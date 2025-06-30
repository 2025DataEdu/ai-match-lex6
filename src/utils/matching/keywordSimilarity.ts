
// 키워드 유사도 계산 유틸리티

// 키워드 유사도 계산 (개선된 버전)
export const calculateKeywordSimilarity = (keywords1: string, keywords2: string): number => {
  if (!keywords1 || !keywords2) return 0;
  
  const keywordArray1 = keywords1.toLowerCase().split(',').map(k => k.trim());
  const keywordArray2 = keywords2.toLowerCase().split(',').map(k => k.trim());
  
  let matchScore = 0;
  
  keywordArray1.forEach(keyword1 => {
    keywordArray2.forEach(keyword2 => {
      // 완전 일치
      if (keyword1 === keyword2) {
        matchScore += 10;
      }
      // 부분 일치 (3글자 이상)
      else if (keyword1.length >= 3 && keyword2.length >= 3) {
        if (keyword1.includes(keyword2) || keyword2.includes(keyword1)) {
          matchScore += 7;
        }
        // 유사한 키워드 (2글자 이상 공통)
        else if (hasSimilarSubstring(keyword1, keyword2)) {
          matchScore += 3;
        }
      }
    });
  });
  
  return Math.min(matchScore, 100);
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

// 매칭된 키워드 추출
export const extractMatchedKeywords = (demandKeywords: string, supplierKeywords: string): string[] => {
  const matchedKeywords: string[] = [];
  
  if (!demandKeywords || !supplierKeywords) return matchedKeywords;
  
  const demandArray = demandKeywords.toLowerCase().split(',').map(k => k.trim());
  const supplierArray = supplierKeywords.toLowerCase().split(',').map(k => k.trim());
  
  demandArray.forEach(dKeyword => {
    supplierArray.forEach(sKeyword => {
      if (dKeyword === sKeyword || 
          (dKeyword.length >= 3 && sKeyword.length >= 3 && 
           (dKeyword.includes(sKeyword) || sKeyword.includes(dKeyword)))) {
        if (!matchedKeywords.includes(dKeyword)) {
          matchedKeywords.push(dKeyword);
        }
      }
    });
  });
  
  return matchedKeywords;
};
