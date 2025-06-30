const AI_SERVICE_KEYWORDS: { [key: string]: string[] } = {
  "AI 챗봇/대화형AI": ["챗봇", "대화형 AI", "자연어 이해", "자동 응답", "가상 비서"],
  "컴퓨터 비전/이미지AI": ["컴퓨터 비전", "이미지 인식", "객체 탐지", "얼굴 인식", "영상 분석"],
  "자연어처리/텍스트AI": ["자연어 처리", "텍스트 분석", "감성 분석", "문서 요약", "텍스트 생성"],
  "음성인식/음성AI": ["음성 인식", "음성 합성", "화자 인식", "음성 분석", "STT", "TTS"],
  "예측분석/데이터AI": ["예측 분석", "데이터 마이닝", "통계 분석", "머신러닝", "데이터 시각화"],
  "추천시스템/개인화AI": ["추천 시스템", "개인화 추천", "협업 필터링", "콘텐츠 기반 추천", "사용자 행동 분석"],
  "로봇/자동화AI": ["로봇", "자동화", "RPA", "스마트 팩토리", "자동 제어"],
  "AI 플랫폼/인프라": ["AI 플랫폼", "AI 인프라", "클라우드 AI", "AI 개발 환경", "GPU 서버"],
  "AI 교육/컨설팅": ["AI 교육", "AI 컨설팅", "AI 워크숍", "AI 솔루션", "AI 도입"],
  "기타 AI 서비스": ["인공지능", "AI", "머신러닝", "딥러닝", "지능형"],
};

const calculateSimilarity = (demand: string, supplierKeywords: string[]): number => {
  const demandWords = demand.toLowerCase().split(/\s+/);
  let matchedKeywords = 0;

  demandWords.forEach(word => {
    if (supplierKeywords.some(keyword => keyword.toLowerCase().includes(word))) {
      matchedKeywords++;
    }
  });

  return matchedKeywords / demandWords.length;
};

export const calculateMatching = (demands: any[], suppliers: any[]): any[] => {
  const matches: any[] = [];

  demands.forEach(demand => {
    suppliers.forEach(supplier => {
      let keywordScore = 0;
      let matchedKeywords: string[] = [];

      // AI 서비스 유형 키워드 매칭
      const aiServiceType = supplier.유형 || "";
      const aiServiceKeywords = AI_SERVICE_KEYWORDS[aiServiceType] || [];
      const demandDescription = demand.세부설명 || "";

      if (aiServiceKeywords.length > 0) {
        const similarity = calculateSimilarity(demandDescription, aiServiceKeywords);
        keywordScore = similarity;

        demandDescription.toLowerCase().split(/\s+/).forEach(word => {
          if (aiServiceKeywords.some(keyword => keyword.toLowerCase().includes(word))) {
            matchedKeywords.push(word);
          }
        });
      }

      // 업종 매칭 (간단하게 완전 일치로 처리)
      const industryMatch = demand.업종 === supplier.업종 ? 1 : 0;

      // 점수 조합 (가중치 적용 가능)
      const capabilityScore = (keywordScore * 0.7) + (industryMatch * 0.3);

      // 매칭 데이터 생성
      matches.push({
        demandId: demand.수요기관일련번호,
        supplierId: supplier.공급기업일련번호,
        companyName: supplier.기업명,
        type: supplier.유형,
        industry: supplier.업종,
        description: supplier.세부설명,
        patents: supplier.보유특허,
        website: supplier.기업홈페이지,
        youtubeLinks: supplier.유튜브링크,
        username: supplier.사용자명,
        registrationDate: supplier.등록일자,
        isInterested: supplier.관심여부 === 'Y',
        hasInquiry: supplier.문의여부 === 'Y',
        score: capabilityScore,
        matchedKeywords: matchedKeywords,
        keywordScore: keywordScore,
        capabilityScore: capabilityScore,
        matchReason: `키워드 점수: ${keywordScore.toFixed(2)}, 업종 일치: ${industryMatch ? 'Yes' : 'No'}`
      });
    });
  });

  return matches;
};

export const groupAndSortMatches = (matches: any[], sortBy: string = 'score', sortOrder: 'asc' | 'desc' = 'desc') => {
  const sortedMatches = [...matches].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'score':
        compareValue = a.score - b.score;
        break;
      case 'company':
        compareValue = a.companyName.localeCompare(b.companyName);
        break;
      case 'date':
        compareValue = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        break;
      default:
        compareValue = a.score - b.score;
    }
    
    return sortOrder === 'desc' ? -compareValue : compareValue;
  });
  
  return sortedMatches;
};
