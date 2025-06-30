
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

import { checkCache, saveToCache } from './cache.ts';
import { analyzeNaturalLanguage } from './naturalLanguageProcessor.ts';
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
        { primaryKeywords: [], serviceType: null, intent: 'supplier_search', queryType: 'search', context: {} }, 
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
    console.log('Analysis result:', JSON.stringify(analysis, null, 2));

    // 3단계: 의도별 쿼리 실행
    let queryResults = [];
    let queryError = null;

    try {
      switch (analysis.intent) {
        case 'statistics':
          queryResults = await executeStatisticsQuery(supabase, analysis);
          break;
        case 'supplier_search':
          queryResults = await executeSupplierSearch(supabase, analysis);
          break;
        case 'demand_search':
          queryResults = await executeDemandSearch(supabase, analysis);
          break;
        case 'matching_info':
          queryResults = []; // 매칭 정보는 별도 응답
          break;
        case 'general_info':
          queryResults = []; // 일반 정보는 별도 응답
          break;
        default:
          queryResults = await executeSupplierSearch(supabase, analysis);
      }

      console.log(`Query completed: ${queryResults.length} results found`);
      
      // 결과를 캐시에 저장 (통계나 정보성 질문 제외)
      if (queryResults.length > 0 && analysis.intent !== 'general_info') {
        await saveToCache(supabase, message, analysis.intent, queryResults);
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
            intent: analysis.intent,
            queryType: analysis.queryType,
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
          intent: analysis.intent,
          queryType: analysis.queryType,
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
        response: '죄송합니다. 일시적인 오류가 발생했습니다. 자연어로 다시 질문해주세요.\n\n예시:\n• "AI 챗봇 개발 전문업체 찾아줘"\n• "공급기업이 총 몇 곳이야?"\n• "CCTV 영상분석할 수 있는 기업 알려줘"'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// 통계 쿼리 실행 - 개선된 버전
async function executeStatisticsQuery(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType, context } = analysis;
  
  console.log('Executing statistics query with:', { primaryKeywords, serviceType, context });
  
  if (context.entity === 'demand') {
    // 수요기관 통계
    let query = supabase.from('수요기관').select('*', { count: 'exact', head: true });
    
    if (serviceType) {
      // 서비스 유형으로 필터링
      const serviceKeywords = serviceType.split(/[\/\s]+/);
      const conditions = serviceKeywords.map(keyword => 
        `수요내용.ilike.%${keyword}%,유형.ilike.%${keyword}%`
      ).join(',');
      query = query.or(conditions);
    } else if (primaryKeywords.length > 0) {
      // 키워드로 필터링
      const keywordConditions = primaryKeywords.map(keyword => 
        `수요내용.ilike.%${keyword}%,유형.ilike.%${keyword}%,수요기관.ilike.%${keyword}%`
      ).join(',');
      query = query.or(keywordConditions);
    }
    
    const { count, error } = await query;
    if (error) {
      console.error('Statistics query error (demand):', error);
      throw error;
    }
    return [{ count }];
  } else {
    // 공급기업 통계 (기본)
    let query = supabase.from('공급기업').select('*', { count: 'exact', head: true });
    
    if (serviceType) {
      // 서비스 유형으로 필터링
      const serviceKeywords = serviceType.split(/[\/\s]+/);
      const conditions = serviceKeywords.map(keyword => 
        `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%`
      ).join(',');
      query = query.or(conditions);
    } else if (primaryKeywords.length > 0) {
      // 키워드로 필터링
      const keywordConditions = primaryKeywords.map(keyword => 
        `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%,업종.ilike.%${keyword}%`
      ).join(',');
      query = query.or(keywordConditions);
    }
    
    const { count, error } = await query;
    if (error) {
      console.error('Statistics query error (supplier):', error);
      throw error;
    }
    return [{ count }];
  }
}

// 공급기업 검색 실행 - 단계별 검색 개선
async function executeSupplierSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Executing supplier search with:', { primaryKeywords, serviceType });

  // 1단계: 서비스 타입 우선 검색
  if (serviceType) {
    const results = await searchByServiceType(supabase, serviceType, primaryKeywords);
    if (results.length > 0) {
      console.log(`Service type search found ${results.length} results`);
      return addRelevanceScores(results, primaryKeywords, serviceType);
    }
  }

  // 2단계: 정확한 키워드 매칭
  if (primaryKeywords.length > 0) {
    const results = await searchByKeywords(supabase, primaryKeywords, true);
    if (results.length > 0) {
      console.log(`Exact keyword search found ${results.length} results`);
      return addRelevanceScores(results, primaryKeywords, serviceType);
    }
  }

  // 3단계: 부분 키워드 매칭  
  if (primaryKeywords.length > 0) {
    const results = await searchByKeywords(supabase, primaryKeywords, false);
    if (results.length > 0) {
      console.log(`Partial keyword search found ${results.length} results`);
      return addRelevanceScores(results, primaryKeywords, serviceType);
    }
  }

  // 4단계: 일반 AI 키워드로 검색
  const broadResults = await searchByBroadTerms(supabase);
  console.log(`Broad search found ${broadResults.length} results`);
  return addRelevanceScores(broadResults, primaryKeywords, serviceType);
}

// 서비스 타입별 검색
async function searchByServiceType(supabase: any, serviceType: string, keywords: string[]) {
  const serviceKeywords = serviceType.split(/[\/\s]+/);
  const conditions = serviceKeywords.map(keyword => 
    `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(15);
    
  if (error) {
    console.error('Service type search error:', error);
    return [];
  }
  return data || [];
}

// 키워드별 검색
async function searchByKeywords(supabase: any, keywords: string[], exact: boolean = true) {
  const searchKeywords = exact ? keywords : keywords.map(k => k.length > 3 ? k.substring(0, 3) : k);
  
  const conditions = searchKeywords.map(keyword => 
    `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%,업종.ilike.%${keyword}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(12);
    
  if (error) {
    console.error('Keyword search error:', error);
    return [];
  }
  return data || [];
}

// 광범위한 검색
async function searchByBroadTerms(supabase: any) {
  const broadTerms = ['AI', '인공지능', '스마트', '지능형', '자동화', '딥러닝', '머신러닝', '챗봇'];
  
  const conditions = broadTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(10);
    
  if (error) {
    console.error('Broad search error:', error);
    // 폴백으로 최신 기업 반환
    const { data: fallbackData } = await supabase
      .from('공급기업')
      .select('*')
      .not('세부설명', 'is', null)
      .order('등록일자', { ascending: false })
      .limit(8);
    return fallbackData || [];
  }
  return data || [];
}

// 관련성 점수 추가
function addRelevanceScores(results: any[], keywords: string[], serviceType: string | null) {
  return results.map(company => {
    let score = 50;
    const companyText = `${company.유형 || ''} ${company.기업명 || ''} ${company.세부설명 || ''} ${company.업종 || ''}`.toLowerCase();
    
    // 서비스 타입 매칭
    if (serviceType && companyText.includes(serviceType.toLowerCase())) {
      score += 40;
    }
    
    // 키워드 매칭
    keywords.forEach((keyword, index) => {
      const weight = Math.max(25 - (index * 5), 10);
      if (companyText.includes(keyword.toLowerCase())) {
        score += weight;
      }
    });
    
    return { ...company, relevance_score: Math.min(score, 100) };
  }).sort((a, b) => b.relevance_score - a.relevance_score);
}

// 수요기관 검색 실행
async function executeDemandSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Executing demand search with:', { primaryKeywords, serviceType });
  
  let query = supabase.from('수요기관').select('*');
  
  if (serviceType) {
    const serviceKeywords = serviceType.split(/[\/\s]+/);
    const serviceConditions = serviceKeywords.map(keyword => 
      `수요내용.ilike.%${keyword}%,유형.ilike.%${keyword}%`
    ).join(',');
    query = query.or(serviceConditions);
  } else if (primaryKeywords.length > 0) {
    const keywordConditions = primaryKeywords.map(keyword => 
      `수요내용.ilike.%${keyword}%,유형.ilike.%${keyword}%,수요기관.ilike.%${keyword}%`
    ).join(',');
    query = query.or(keywordConditions);
  }
  
  const { data, error } = await query.limit(10);
  if (error) {
    console.error('Demand search error:', error);
    throw error;
  }
  return data || [];
}
