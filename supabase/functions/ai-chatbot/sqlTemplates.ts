
// 템플릿 기반 빠른 SQL 생성
export function generateQuickSQL(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // 금액 관련 쿼리 템플릿
  if (lowerMessage.includes('억') && (lowerMessage.includes('이상') || lowerMessage.includes('넘') || lowerMessage.includes('초과'))) {
    const matches = lowerMessage.match(/(\d+)억/);
    if (matches) {
      const amount = parseInt(matches[1]) * 10000; // 만원 단위로 변환
      return `SELECT * FROM 수요기관 WHERE 금액 >= ${amount} ORDER BY 금액 DESC LIMIT 20`;
    }
  }
  
  // 특허 관련 쿼리 템플릿
  if (lowerMessage.includes('특허')) {
    return `SELECT * FROM 공급기업 WHERE 보유특허 IS NOT NULL AND 보유특허 != '' LIMIT 20`;
  }
  
  // AI 관련 쿼리 템플릿
  if (lowerMessage.includes('ai') || lowerMessage.includes('인공지능')) {
    return `SELECT * FROM 공급기업 WHERE 세부설명 ILIKE '%AI%' OR 업종 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%' OR 업종 ILIKE '%인공지능%' LIMIT 20`;
  }
  
  // 일반적인 키워드 검색 템플릿
  const keywords = lowerMessage.split(' ').filter(word => word.length > 1);
  if (keywords.length > 0) {
    const conditions = keywords.map(keyword => 
      `(기업명 ILIKE '%${keyword}%' OR 업종 ILIKE '%${keyword}%' OR 세부설명 ILIKE '%${keyword}%')`
    ).join(' OR ');
    return `SELECT * FROM 공급기업 WHERE ${conditions} LIMIT 20`;
  }
  
  return null;
}
