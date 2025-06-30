
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';
import { 
  searchByExactType, 
  searchAllFields, 
  addEnhancedRelevanceScores, 
  removeDuplicateSuppliers 
} from './searchStrategies.ts';

// 단순한 통계 쿼리
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

// 단순한 공급기업 검색
export async function executeEnhancedSupplierSearch(supabase: any, analysis: KeywordAnalysis) {
  const { primaryKeywords, serviceType } = analysis;
  
  const searchTerms = [];
  if (serviceType) searchTerms.push(serviceType);
  if (primaryKeywords) searchTerms.push(...primaryKeywords);

  if (searchTerms.length === 0) {
    const { data, error } = await supabase
      .from('공급기업')
      .select('*')
      .limit(5);
    return data || [];
  }

  let results = [];
  
  // 1단계: 유형 필드 검색
  const typeResults = await searchByExactType(supabase, searchTerms);
  results.push(...typeResults);

  // 2단계: 전체 필드 검색 (결과가 부족한 경우)
  if (results.length < 3) {
    const allResults = await searchAllFields(supabase, searchTerms);
    results.push(...allResults);
  }

  const uniqueResults = removeDuplicateSuppliers(results);
  const scoredResults = addEnhancedRelevanceScores(uniqueResults, searchTerms);

  return scoredResults.slice(0, 5);
}

// 단순한 수요기관 검색
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
