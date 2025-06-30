
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
          queryResults = await executeEnhancedStatisticsQuery(supabase, analysis);
          break;
        case 'supplier_search':
          queryResults = await executeEnhancedSupplierSearch(supabase, analysis);
          break;
        case 'demand_search':
          queryResults = await executeEnhancedDemandSearch(supabase, analysis);
          break;
        case 'matching_info':
          queryResults = []; // 매칭 정보는 별도 응답
          break;
        case 'general_info':
          queryResults = []; // 일반 정보는 별도 응답
          break;
        default:
          queryResults = await executeEnhancedSupplierSearch(supabase, analysis);
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

// 향상된 통계 쿼리 - 실제 데이터베이스의 메인 통계 반환
async function executeEnhancedStatisticsQuery(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType, context } = analysis;
  
  console.log('Executing enhanced statistics query with:', { primaryKeywords, serviceType, context });
  
  try {
    // 공급기업과 수요기관의 전체 통계 가져오기
    const [suppliersResult, demandsResult] = await Promise.all([
      supabase.from('공급기업').select('*', { count: 'exact', head: true }),
      supabase.from('수요기관').select('*', { count: 'exact', head: true })
    ]);

    const totalSuppliers = suppliersResult.count || 0;
    const totalDemands = demandsResult.count || 0;

    // 키워드나 서비스 타입이 있는 경우 필터링된 통계도 함께 제공
    let filteredStats = null;
    
    if (serviceType || (primaryKeywords && primaryKeywords.length > 0)) {
      let supplierQuery = supabase.from('공급기업').select('*', { count: 'exact', head: true });
      let demandQuery = supabase.from('수요기관').select('*', { count: 'exact', head: true });
      
      // 검색 조건 구성
      const searchTerms = [];
      if (serviceType) searchTerms.push(serviceType);
      if (primaryKeywords) searchTerms.push(...primaryKeywords);
      
      if (searchTerms.length > 0) {
        const supplierConditions = searchTerms.map(term => 
          `유형.ilike.%${term}%,세부설명.ilike.%${term}%,기업명.ilike.%${term}%,업종.ilike.%${term}%,보유특허.ilike.%${term}%,추출키워드.ilike.%${term}%`
        ).join(',');
        
        const demandConditions = searchTerms.map(term => 
          `수요내용.ilike.%${term}%,유형.ilike.%${term}%,수요기관.ilike.%${term}%,추출키워드.ilike.%${term}%`
        ).join(',');
        
        supplierQuery = supplierQuery.or(supplierConditions);
        demandQuery = demandQuery.or(demandConditions);
      }
      
      const [filteredSuppliers, filteredDemands] = await Promise.all([
        supplierQuery,
        demandQuery
      ]);
      
      filteredStats = {
        suppliers: filteredSuppliers.count || 0,
        demands: filteredDemands.count || 0
      };
    }

    return [{
      type: 'comprehensive_stats',
      totalSuppliers,
      totalDemands,
      filteredStats,
      searchTerms: serviceType ? [serviceType] : primaryKeywords,
      entity: context?.entity || 'both'
    }];
    
  } catch (error) {
    console.error('Enhanced statistics query error:', error);
    throw error;
  }
}

// 향상된 공급기업 검색 - 모든 관련 필드에서 검색
async function executeEnhancedSupplierSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Executing enhanced supplier search with:', { primaryKeywords, serviceType });

  // 검색어 통합 (서비스 타입 + 키워드)
  const allSearchTerms = [];
  if (serviceType) {
    allSearchTerms.push(serviceType);
    // 서비스 타입을 키워드로 분해
    allSearchTerms.push(...serviceType.split(/[\/\s]+/).filter(t => t.length > 1));
  }
  if (primaryKeywords && primaryKeywords.length > 0) {
    allSearchTerms.push(...primaryKeywords);
  }

  if (allSearchTerms.length === 0) {
    // 기본 AI 관련 기업 반환
    const { data, error } = await supabase
      .from('공급기업')
      .select('*')
      .or('유형.ilike.%AI%,유형.ilike.%인공지능%,세부설명.ilike.%AI%,세부설명.ilike.%인공지능%')
      .not('세부설명', 'is', null)
      .order('등록일자', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    return addEnhancedRelevanceScores(data || [], allSearchTerms);
  }

  let bestResults = [];

  // 1단계: 정확한 매칭 (유형 필드 우선)
  const exactTypeResults = await searchByExactType(supabase, allSearchTerms);
  bestResults.push(...exactTypeResults);

  // 2단계: 전체 필드 통합 검색
  if (bestResults.length < 8) {
    const comprehensiveResults = await searchAllFields(supabase, allSearchTerms);
    bestResults.push(...comprehensiveResults);
  }

  // 3단계: 부분 매칭 (키워드 일부만 매칭)
  if (bestResults.length < 5) {
    const partialResults = await searchPartialMatch(supabase, allSearchTerms);
    bestResults.push(...partialResults);
  }

  // 중복 제거 및 관련성 점수 계산
  const uniqueResults = removeDuplicateSuppliers(bestResults);
  const scoredResults = addEnhancedRelevanceScores(uniqueResults, allSearchTerms);

  console.log(`Enhanced supplier search found ${scoredResults.length} results`);
  return scoredResults.slice(0, 10);
}

// 정확한 유형 매칭
async function searchByExactType(supabase: any, searchTerms: string[]) {
  const typeConditions = searchTerms.map(term => `유형.ilike.%${term}%`).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(typeConditions)
    .not('세부설명', 'is', null)
    .limit(8);
    
  if (error) {
    console.error('Exact type search error:', error);
    return [];
  }
  return data || [];
}

// 모든 필드 통합 검색
async function searchAllFields(supabase: any, searchTerms: string[]) {
  const allFieldConditions = searchTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%,기업명.ilike.%${term}%,업종.ilike.%${term}%,보유특허.ilike.%${term}%,추출키워드.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(allFieldConditions)
    .not('세부설명', 'is', null)
    .limit(15);
    
  if (error) {
    console.error('All fields search error:', error);
    return [];
  }
  return data || [];
}

// 부분 매칭 검색
async function searchPartialMatch(supabase: any, searchTerms: string[]) {
  const partialTerms = searchTerms.map(term => 
    term.length > 2 ? term.substring(0, Math.max(2, term.length - 1)) : term
  );
  
  const partialConditions = partialTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(partialConditions)
    .not('세부설명', 'is', null)
    .limit(8);
    
  if (error) {
    console.error('Partial match search error:', error);
    return [];
  }
  return data || [];
}

// 향상된 관련성 점수 계산
function addEnhancedRelevanceScores(results: any[], searchTerms: string[]) {
  return results.map(company => {
    let score = 20; // 기본 점수
    
    const allCompanyText = [
      company.유형 || '',
      company.기업명 || '',
      company.세부설명 || '',
      company.업종 || '',
      company.보유특허 || '',
      company.추출키워드 || ''
    ].join(' ').toLowerCase();
    
    searchTerms.forEach((term, index) => {
      const termLower = term.toLowerCase();
      const baseWeight = Math.max(25 - (index * 3), 10);
      
      // 필드별 가중치 적용
      if ((company.유형 || '').toLowerCase().includes(termLower)) {
        score += baseWeight + 15; // 유형 필드 최고 가중치
      }
      if ((company.기업명 || '').toLowerCase().includes(termLower)) {
        score += baseWeight + 10;
      }
      if ((company.세부설명 || '').toLowerCase().includes(termLower)) {
        score += baseWeight + 5;
      }
      if ((company.보유특허 || '').toLowerCase().includes(termLower)) {
        score += baseWeight + 8;
      }
      if ((company.추출키워드 || '').toLowerCase().includes(termLower)) {
        score += baseWeight + 12;
      }
      if ((company.업종 || '').toLowerCase().includes(termLower)) {
        score += baseWeight;
      }
    });
    
    // 데이터 충실도 보너스
    if (company.세부설명 && company.세부설명.length > 50) score += 5;
    if (company.보유특허 && company.보유특허.trim() !== '') score += 8;
    if (company.추출키워드 && company.추출키워드.trim() !== '') score += 10;
    
    return { ...company, relevance_score: Math.min(score, 100) };
  }).sort((a, b) => b.relevance_score - a.relevance_score);
}

// 향상된 수요기관 검색
async function executeEnhancedDemandSearch(supabase: any, analysis: any) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Executing enhanced demand search with:', { primaryKeywords, serviceType });
  
  const allSearchTerms = [];
  if (serviceType) allSearchTerms.push(serviceType, ...serviceType.split(/[\/\s]+/).filter(t => t.length > 1));
  if (primaryKeywords && primaryKeywords.length > 0) allSearchTerms.push(...primaryKeywords);

  if (allSearchTerms.length === 0) {
    const { data, error } = await supabase
      .from('수요기관')
      .select('*')
      .not('수요내용', 'is', null)
      .order('등록일자', { ascending: false })
      .limit(5);
    if (error) throw error;
    return data || [];
  }

  const conditions = allSearchTerms.map(term => 
    `수요내용.ilike.%${term}%,유형.ilike.%${term}%,수요기관.ilike.%${term}%,추출키워드.ilike.%${term}%,기타요구사항.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('수요기관')
    .select('*')
    .or(conditions)
    .not('수요내용', 'is', null)
    .order('등록일자', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Enhanced demand search error:', error);
    throw error;
  }
  return data || [];
}

// 중복 제거 함수
function removeDuplicateSuppliers(results: any[]) {
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
