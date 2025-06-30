
// 단순하고 효과적인 검색 전략
export async function searchByExactType(supabase: any, searchTerms: string[]) {
  if (searchTerms.length === 0) return [];
  
  const conditions = searchTerms.map(term => `유형.ilike.%${term}%`).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(5);
    
  if (error) {
    console.error('Type search error:', error);
    return [];
  }
  return data || [];
}

export async function searchAllFields(supabase: any, searchTerms: string[]) {
  if (searchTerms.length === 0) return [];
  
  const conditions = searchTerms.map(term => 
    `유형.ilike.%${term}%,세부설명.ilike.%${term}%,기업명.ilike.%${term}%`
  ).join(',');
  
  const { data, error } = await supabase
    .from('공급기업')
    .select('*')
    .or(conditions)
    .limit(8);
    
  if (error) {
    console.error('All fields search error:', error);
    return [];
  }
  return data || [];
}

export function addEnhancedRelevanceScores(results: any[], searchTerms: string[]) {
  return results.map(company => {
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
}

export function removeDuplicateSuppliers(results: any[]) {
  const seen = new Set();
  return results.filter(item => {
    const key = item.공급기업일련번호 || item.기업명;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
