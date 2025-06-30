
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';
import { 
  searchByExactType, 
  searchAllFields, 
  searchPartialMatch, 
  addEnhancedRelevanceScores, 
  removeDuplicateSuppliers 
} from './searchStrategies.ts';

// 향상된 통계 쿼리
export async function executeEnhancedStatisticsQuery(supabase: any, analysis: KeywordAnalysis) {
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

// 향상된 공급기업 검색
export async function executeEnhancedSupplierSearch(supabase: any, analysis: KeywordAnalysis) {
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

// 향상된 수요기관 검색
export async function executeEnhancedDemandSearch(supabase: any, analysis: KeywordAnalysis) {
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
