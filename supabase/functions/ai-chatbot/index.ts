
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

import { checkCache, saveToCache } from './cache.ts';
import { analyzeNaturalLanguage } from './naturalLanguageProcessor.ts';
import { buildIntelligentQuery } from './intelligentQueryBuilder.ts';
import { formatIntelligentResponse } from './intelligentResponseFormatter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Processing natural language query:', message);

    // 1단계: 캐시 확인
    const cacheResult = await checkCache(supabase, message);
    if (cacheResult.found) {
      console.log('Cache hit! Returning cached result');
      
      const cachedResponse = formatIntelligentResponse(
        message, 
        { primaryKeywords: [], serviceType: null, intent: 'search', context: {} }, 
        cacheResult.data
      ) + '\n\n⚡ (빠른 검색 결과)';
      
      return new Response(
        JSON.stringify({ 
          response: cachedResponse,
          context: {
            cached: true,
            results_count: cacheResult.data?.length || 0
          }
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2단계: 자연어 분석 (ChatGPT API 사용)
    console.log('Analyzing natural language query...');
    const analysis = await analyzeNaturalLanguage(message, openAIApiKey);
    console.log('Analysis result:', analysis);

    // 3단계: 다단계 검색 실행
    let queryResults = [];
    let queryError = null;

    try {
      // 첫 번째 시도: 정확한 키워드 매칭
      console.log('Attempting exact keyword search...');
      queryResults = await performExactSearch(supabase, analysis);
      
      // 두 번째 시도: 부분 매칭 (결과가 없을 경우)
      if (queryResults.length === 0) {
        console.log('No exact matches, trying partial search...');
        queryResults = await performPartialSearch(supabase, analysis);
      }
      
      // 세 번째 시도: 광범위한 검색 (여전히 결과가 없을 경우)
      if (queryResults.length === 0) {
        console.log('No partial matches, trying broad search...');
        queryResults = await performBroadSearch(supabase, analysis);
      }
      
      // 네 번째 시도: 전체 데이터에서 최신 항목 (마지막 폴백)
      if (queryResults.length === 0) {
        console.log('No matches found, returning recent entries...');
        queryResults = await performFallbackSearch(supabase);
      }

      console.log(`Search completed: ${queryResults.length} results found`);
      
      // 관련성 점수 계산 및 정렬
      queryResults = queryResults.map(company => {
        let score = 50; // 기본 점수
        
        const companyText = `${company.유형 || ''} ${company.기업명 || ''} ${company.세부설명 || ''} ${company.업종 || ''}`.toLowerCase();
        
        // 서비스 유형 매칭 (높은 가중치)
        if (analysis.serviceType && companyText.includes(analysis.serviceType.toLowerCase())) {
          score += 30;
        }
        
        // 키워드 매칭
        analysis.primaryKeywords.forEach((keyword, index) => {
          const weight = Math.max(20 - (index * 5), 5);
          if (companyText.includes(keyword.toLowerCase())) {
            score += weight;
          }
        });
        
        return { ...company, relevance_score: score };
      }).sort((a, b) => b.relevance_score - a.relevance_score);
      
      // 결과를 캐시에 저장
      if (queryResults.length > 0) {
        await saveToCache(supabase, message, 'intelligent_search', queryResults);
      }
      
    } catch (error) {
      console.error('Query execution error:', error);
      queryError = error;
    }

    // 4단계: 지능형 응답 생성
    const aiResponse = formatIntelligentResponse(message, analysis, queryResults, queryError);

    // 채팅 기록 저장
    try {
      const { error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          message: message,
          response: aiResponse,
          context: {
            analysis: analysis,
            results_count: queryResults.length,
            intelligent_search: true,
            cached: false
          },
        });

      if (saveError) {
        console.error('Error saving chat message:', saveError);
      }
    } catch (saveError) {
      console.error('Chat save error:', saveError);
    }

    console.log('Intelligent AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        context: {
          analysis: analysis,
          results_count: queryResults.length,
          intelligent_search: true,
          cached: false
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: '죄송합니다. 일시적인 오류가 발생했습니다. 자연어로 다시 질문해주세요.\n\n예시:\n• "AI 챗봇 개발 전문업체 찾아줘"\n• "CCTV 영상분석할 수 있는 기업 알려줘"\n• "음성인식 기술 보유한 회사 추천해줘"'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// 정확한 키워드 매칭 검색
async function performExactSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  let query = supabase.from('공급기업').select('*');
  
  if (serviceType) {
    const serviceKeywords = serviceType.split(/[\/\s]+/);
    const serviceConditions = serviceKeywords.map(keyword => 
      `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%`
    ).join(',');
    query = query.or(serviceConditions);
  } else if (primaryKeywords.length > 0) {
    const keywordConditions = primaryKeywords.map(keyword => 
      `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%`
    ).join(',');
    query = query.or(keywordConditions);
  }
  
  const { data, error } = await query.limit(10);
  if (error) throw error;
  return data || [];
}

// 부분 매칭 검색 (더 관대한 조건)
async function performPartialSearch(supabase: any, analysis: any) {
  const { primaryKeywords } = analysis;
  
  if (primaryKeywords.length === 0) return [];
  
  // 키워드를 더 짧게 잘라서 검색
  const shortKeywords = primaryKeywords.map(keyword => 
    keyword.length > 3 ? keyword.substring(0, 3) : keyword
  );
  
  const conditions = shortKeywords.map(keyword => 
    `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%,업종.ilike.%${keyword}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(10);
    
  if (error) throw error;
  return data || [];
}

// 광범위한 검색 (AI 관련 일반 검색)
async function performBroadSearch(supabase: any, analysis: any) {
  const broadTerms = ['AI', '인공지능', '스마트', '지능형', '자동화', '딥러닝', '머신러닝'];
  
  const conditions = broadTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(15);
    
  if (error) throw error;
  return data || [];
}

// 폴백 검색 (최신 등록 기업)
async function performFallbackSearch(supabase: any) {
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .not('세부설명', 'is', null)
    .not('유형', 'is', null)
    .order('등록일자', { ascending: false })
    .limit(8);
    
  if (error) throw error;
  return data || [];
}
