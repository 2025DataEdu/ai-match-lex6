
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';
import { generateSQLWithAI } from './aiSqlGenerator.ts';

// 통계 쿼리 실행
export async function executeEnhancedStatisticsQuery(supabase: any, analysis: KeywordAnalysis) {
  try {
    const [suppliersResult, demandsResult] = await Promise.all([
      supabase.from('공급기업').select('*', { count: 'exact', head: true }),
      supabase.from('수요기관').select('*', { count: 'exact', head: true })
    ]);

    return [{
      type: 'simple_stats',
      totalSuppliers: suppliersResult.count || 0,
      totalDemands: demandsResult.count || 0
    }];
  } catch (error) {
    console.error('Statistics query error:', error);
    throw error;
  }
}

// 공급기업 검색 - ChatGPT 기반 동적 SQL 사용
export async function executeEnhancedSupplierSearch(supabase: any, analysis: KeywordAnalysis) {
  const { primaryKeywords, serviceType } = analysis;
  
  // 키워드가 없으면 기본 검색
  if (!primaryKeywords.length && !serviceType) {
    const { data, error } = await supabase
      .from('공급기업')
      .select('*')
      .limit(5);
    return data || [];
  }

  try {
    // ChatGPT를 사용해서 동적 SQL 생성 시도
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openAIApiKey) {
      const searchQuery = [serviceType, ...primaryKeywords].filter(Boolean).join(' ');
      const dynamicSQL = await generateSQLWithAI(searchQuery, openAIApiKey);
      
      console.log('Generated Dynamic SQL:', dynamicSQL);
      
      // 동적 SQL 실행
      const { data: dynamicResults, error: dynamicError } = await supabase.rpc(
        'execute_dynamic_query',
        { query_text: dynamicSQL }
      );
      
      if (!dynamicError && dynamicResults && dynamicResults.length > 0) {
        console.log('Dynamic SQL Results:', dynamicResults.length);
        return dynamicResults.slice(0, 8);
      }
    }
  } catch (error) {
    console.error('Dynamic SQL execution failed:', error);
  }

  // 백업: 기존 검색 로직
  const searchTerms = [];
  if (serviceType) searchTerms.push(serviceType);
  if (primaryKeywords) searchTerms.push(...primaryKeywords);

  const conditions = searchTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%,기업명.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(8);
    
  if (error) {
    console.error('Fallback search error:', error);
    throw error;
  }
  
  // 관련성 점수 추가
  const scoredResults = (data || []).map(company => {
    let score = 50;
    
    const allText = [
      company.유형 || '',
      company.기업명 || '',
      company.세부설명 || ''
    ].join(' ').toLowerCase();
    
    searchTerms.forEach(term => {
      if (allText.includes(term.toLowerCase())) {
        score += 20;
      }
    });
    
    return { ...company, relevance_score: score };
  }).sort((a, b) => b.relevance_score - a.relevance_score);

  return scoredResults.slice(0, 5);
}

// 수요기관 검색
export async function executeEnhancedDemandSearch(supabase: any, analysis: KeywordAnalysis) {
  const { primaryKeywords, serviceType } = analysis;
  
  const searchTerms = [];
  if (serviceType) searchTerms.push(serviceType);
  if (primaryKeywords) searchTerms.push(...primaryKeywords);

  if (searchTerms.length === 0) {
    const { data, error } = await supabase
      .from('수요기관')
      .select('*')
      .limit(5);
    return data || [];
  }

  const conditions = searchTerms.map(term => 
    `수요내용.ilike.%${term}%,유형.ilike.%${term}%,수요기관.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('수요기관')
    .select('*')
    .or(conditions)
    .limit(5);
    
  if (error) {
    console.error('Demand search error:', error);
    throw error;
  }
  return data || [];
}
