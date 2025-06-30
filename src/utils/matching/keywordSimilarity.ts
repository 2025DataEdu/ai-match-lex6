
// 키워드 유사도 계산 유틸리티 (개선된 버전)

// 키워드 유사도 계산 - 정확한 매칭에 높은 점수 부여
export const calculateKeywordSimilarity = (keywords1: string, keywords2: string): { score: number, matchedKeywords: string[] } => {
  if (!keywords1 || !keywords2) return { score: 0, matchedKeywords: [] };
  
  const keywordArray1 = keywords1.toLowerCase().split(',').map(k => k.trim()).filter(k => k.length > 0);
  const keywordArray2 = keywords2.toLowerCase().split(',').map(k => k.trim()).filter(k => k.length > 0);
  
  let totalScore = 0;
  const matchedKeywords: string[] = [];
  
  keywordArray1.forEach(keyword1 => {
    let bestMatch = { score: 0, keyword: '' };
    
    keywordArray2.forEach(keyword2 => {
      let matchScore = 0;
      
      // 1. 완전 일치 (최고 점수)
      if (keyword1 === keyword2) {
        matchScore = 20;
      }
      // 2. 한 키워드가 다른 키워드를 완전히 포함 (높은 점수)
      else if (keyword1.length >= 3 && keyword2.length >= 3) {
        if (keyword1.includes(keyword2) || keyword2.includes(keyword1)) {
          matchScore = 15;
        }
        // 3. 유사한 부분 문자열 (중간 점수)
        else if (hasSimilarSubstring(keyword1, keyword2)) {
          matchScore = 8;
        }
      }
      
      if (matchScore > bestMatch.score) {
        bestMatch = { score: matchScore, keyword: keyword1 };
      }
    });
    
    if (bestMatch.score > 0) {
      totalScore += bestMatch.score;
      if (!matchedKeywords.includes(bestMatch.keyword)) {
        matchedKeywords.push(bestMatch.keyword);
      }
    }
  });
  
  return {
    score: Math.min(totalScore, 100),
    matchedKeywords
  };
};

// 유사한 부분 문자열 검사
export const hasSimilarSubstring = (str1: string, str2: string): boolean => {
  if (str1.length < 2 || str2.length < 2) return false;
  
  for (let i = 0; i <= str1.length - 2; i++) {
    const substring = str1.substring(i, i + 2);
    if (str2.includes(substring)) {
      return true;
    }
  }
  return false;
};

// 매칭된 키워드 추출 (기존 함수는 호환성을 위해 유지)
export const extractMatchedKeywords = (demandKeywords: string, supplierKeywords: string): string[] => {
  const result = calculateKeywordSimilarity(demandKeywords, supplierKeywords);
  return result.matchedKeywords;
};
