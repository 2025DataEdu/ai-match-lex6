
// 정확한 유형 매칭
export async function searchByExactType(supabase: any, searchTerms: string[]) {
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
export async function searchAllFields(supabase: any, searchTerms: string[]) {
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
export async function searchPartialMatch(supabase: any, searchTerms: string[]) {
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
export function addEnhancedRelevanceScores(results: any[], searchTerms: string[]) {
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

// 중복 제거 함수
export function removeDuplicateSuppliers(results: any[]) {
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
