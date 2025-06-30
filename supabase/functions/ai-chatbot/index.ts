
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

    // 3단계: 의도별 정확한 쿼리 실행
    let queryResults = [];
    let queryError = null;

    try {
      switch (analysis.intent) {
        case 'statistics':
          queryResults = await executeAccurateStatisticsQuery(supabase, analysis);
          break;
        case 'supplier_search':
          queryResults = await executeSmartSupplierSearch(supabase, analysis);
          break;
        case 'demand_search':
          queryResults = await executeSmartDemandSearch(supabase, analysis);
          break;
        case 'matching_info':
          queryResults = []; // 매칭 정보는 별도 응답
          break;
        case 'general_info':
          queryResults = []; // 일반 정보는 별도 응답
          break;
        default:
          queryResults = await executeSmartSupplierSearch(supabase, analysis);
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

// 정확한 통계 쿼리 실행 - 실제 count 값 반환
async function executeAccurateStatisticsQuery(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType, context } = analysis;
  
  console.log('Executing accurate statistics query with:', { primaryKeywords, serviceType, context });
  
  if (context.entity === 'demand') {
    // 수요기관 통계 - 정확한 카운트
    let query = supabase.from('수요기관').select('*', { count: 'exact', head: true });
    
    if (serviceType) {
      const serviceKeywords = serviceType.split(/[\/\s]+/);
      const conditions = serviceKeywords.map(keyword => 
        `수요내용.ilike.%${keyword}%,유형.ilike.%${keyword}%`
      ).join(',');
      query = query.or(conditions);
    } else if (primaryKeywords.length > 0) {
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
    return [{ type: 'demand_count', count: count || 0 }];
  } else {
    // 공급기업 통계 - 정확한 카운트
    let query = supabase.from('공급기업').select('*', { count: 'exact', head: true });
    
    if (serviceType) {
      const serviceKeywords = serviceType.split(/[\/\s]+/);
      const conditions = serviceKeywords.map(keyword => 
        `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%`
      ).join(',');
      query = query.or(conditions);
    } else if (primaryKeywords.length > 0) {
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
    return [{ type: 'supplier_count', count: count || 0 }];
  }
}

// 스마트한 공급기업 검색 - 관련성 기반 필터링
async function executeSmartSupplierSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Executing smart supplier search with:', { primaryKeywords, serviceType });

  let bestResults = [];

  // 1단계: 서비스 타입 우선 검색 (가장 정확한 매칭)
  if (serviceType) {
    bestResults = await searchSuppliersByServiceType(supabase, serviceType);
    if (bestResults.length >= 3) {
      console.log(`Service type search found ${bestResults.length} highly relevant results`);
      return addSmartRelevanceScores(bestResults, primaryKeywords, serviceType).slice(0, 8);
    }
  }

  // 2단계: 정확한 키워드 매칭
  if (primaryKeywords.length > 0) {
    const keywordResults = await searchSuppliersByKeywords(supabase, primaryKeywords, true);
    bestResults = [...bestResults, ...keywordResults];
    
    if (bestResults.length >= 3) {
      console.log(`Exact keyword search found ${bestResults.length} relevant results`);
      return removeDuplicates(addSmartRelevanceScores(bestResults, primaryKeywords, serviceType)).slice(0, 8);
    }
  }

  // 3단계: 부분 키워드 매칭
  if (primaryKeywords.length > 0) {
    const partialResults = await searchSuppliersByKeywords(supabase, primaryKeywords, false);
    bestResults = [...bestResults, ...partialResults];
    
    if (bestResults.length >= 3) {
      console.log(`Partial keyword search found ${bestResults.length} results`);
      return removeDuplicates(addSmartRelevanceScores(bestResults, primaryKeywords, serviceType)).slice(0, 6);
    }
  }

  // 4단계: 광범위한 AI 관련 검색 (최후의 수단)
  const broadResults = await searchSuppliersByBroadTerms(supabase);
  bestResults = [...bestResults, ...broadResults];
  
  console.log(`Final search found ${bestResults.length} results`);
  return removeDuplicates(addSmartRelevanceScores(bestResults, primaryKeywords, serviceType)).slice(0, 5);
}

// 서비스 타입별 정확한 검색
async function searchSuppliersByServiceType(supabase: any, serviceType: string) {
  const serviceKeywords = serviceType.split(/[\/\s]+/).filter(k => k.length > 1);
  
  const conditions = serviceKeywords.map(keyword => 
    `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .not('세부설명', 'is', null)
    .limit(10);
    
  if (error) {
    console.error('Service type search error:', error);
    return [];
  }
  return data || [];
}

// 키워드별 정밀 검색
async function searchSuppliersByKeywords(supabase: any, keywords: string[], exact: boolean = true) {
  const searchKeywords = exact ? keywords : keywords.map(k => k.length > 2 ? k.substring(0, Math.max(2, k.length - 1)) : k);
  
  const conditions = searchKeywords.map(keyword => 
    `유형.ilike.%${keyword}%,세부설명.ilike.%${keyword}%,기업명.ilike.%${keyword}%,업종.ilike.%${keyword}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .not('세부설명', 'is', null)
    .limit(8);
    
  if (error) {
    console.error('Keyword search error:', error);
    return [];
  }
  return data || [];
}

// 광범위한 AI 관련 검색
async function searchSuppliersByBroadTerms(supabase: any) {
  const broadTerms = ['AI', '인공지능', '스마트', '지능형', '자동화'];
  
  const conditions = broadTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .not('세부설명', 'is', null)
    .order('등록일자', { ascending: false })
    .limit(5);
    
  if (error) {
    console.error('Broad search error:', error);
    return [];
  }
  return data || [];
}

// 스마트한 관련성 점수 계산
function addSmartRelevanceScores(results: any[], keywords: string[], serviceType: string | null) {
  return results.map(company => {
    let score = 30; // 기본 점수
    const companyText = `${company.유형 || ''} ${company.기업명 || ''} ${company.세부설명 || ''} ${company.업종 || ''}`.toLowerCase();
    
    // 서비스 타입 완전 매칭 (최고 점수)
    if (serviceType) {
      const serviceWords = serviceType.toLowerCase().split(/[\/\s]+/);
      const perfectMatch = serviceWords.some(word => companyText.includes(word));
      if (perfectMatch) score += 50;
    }
    
    // 키워드 정확도별 가중치
    keywords.forEach((keyword, index) => {
      const weight = Math.max(30 - (index * 8), 10);
      const keywordLower = keyword.toLowerCase();
      
      if (companyText.includes(keywordLower)) {
        score += weight;
        
        // 제목이나 유형에 포함된 경우 추가 점수
        if ((company.유형 || '').toLowerCase().includes(keywordLower)) {
          score += 15;
        }
        if ((company.기업명 || '').toLowerCase().includes(keywordLower)) {
          score += 10;
        }
      }
    });
    
    // 세부설명 충실도 보너스
    if (company.세부설명 && company.세부설명.length > 50) {
      score += 5;
    }
    
    return { ...company, relevance_score: Math.min(score, 100) };
  }).sort((a, b) => b.relevance_score - a.relevance_score);
}

// 중복 제거 함수
function removeDuplicates(results: any[]) {
  const seen = new Set();
  return results.filter(item => {
    const key = item.공급기업일련번호 || item.기업명;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 스마트한 수요기관 검색
async function executeSmartDemandSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Executing smart demand search with:', { primaryKeywords, serviceType });
  
  let query = supabase.from('수요기관').select('*');
  
  if (serviceType) {
    const serviceKeywords = serviceType.split(/[\/\s]+/).filter(k => k.length > 1);
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
  
  const { data, error } = await query
    .not('수요내용', 'is', null)
    .order('등록일자', { ascending: false })
    .limit(8);
    
  if (error) {
    console.error('Demand search error:', error);
    throw error;
  }
  return data || [];
}
