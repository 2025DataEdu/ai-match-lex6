
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';

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

// 공급기업 검색 실행
export async function executeEnhancedSupplierSearch(supabase: any, analysis: KeywordAnalysis) {
  const { primaryKeywords, serviceType } = analysis;
  
  // 키워드가 없으면 최신 기업들 반환
  if (!primaryKeywords.length && !serviceType) {
    const { data, error } = await supabase
      .from('공급기업')
      .select('*')
      .order('등록일자', { ascending: false })
      .limit(5);
    return data || [];
  }

  const searchTerms = [];
  if (serviceType) searchTerms.push(serviceType);
  if (primaryKeywords) searchTerms.push(...primaryKeywords);

  const conditions = searchTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%,기업명.ilike.%${term}%,업종.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .order('등록일자', { ascending: false })
    .limit(8);
    
  if (error) {
    console.error('Supplier search error:', error);
    throw error;
  }
  
  return data || [];
}

// 수요기관 검색 실행
export async function executeEnhancedDemandSearch(supabase: any, analysis: KeywordAnalysis) {
  const { primaryKeywords, serviceType } = analysis;
  
  console.log('Demand search with keywords:', primaryKeywords, 'serviceType:', serviceType);
  
  // 키워드가 없으면 최신 수요기관들 반환
  if (!primaryKeywords.length && !serviceType) {
    const { data, error } = await supabase
      .from('수요기관')
      .select('*')
      .order('등록일자', { ascending: false })
      .limit(5);
    console.log('Default demand results:', data?.length);
    return data || [];
  }

  const searchTerms = [];
  if (serviceType) searchTerms.push(serviceType);
  if (primaryKeywords) searchTerms.push(...primaryKeywords);

  const conditions = searchTerms.map(term => 
    `수요내용.ilike.%${term}%,유형.ilike.%${term}%,수요기관.ilike.%${term}%,기타요구사항.ilike.%${term}%`
  ).join(',');
  
  console.log('Demand search conditions:', conditions);
  
  const { data, error } = await supabase
    .from('수요기관')
    .select('*')
    .or(conditions)
    .order('등록일자', { ascending: false })
    .limit(8);
    
  if (error) {
    console.error('Demand search error:', error);
    throw error;
  }
  
  console.log('Demand search results:', data?.length);
  return data || [];
}
