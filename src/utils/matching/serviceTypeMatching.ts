
// AI 서비스 유형 매칭 유틸리티 (개선된 버전)

// AI 서비스 유형 키워드 매핑
export const AI_SERVICE_KEYWORDS: { [key: string]: string[] } = {
  "AI 챗봇/대화형AI": ["챗봇", "대화형", "자연어", "응답", "상담", "문의", "bot", "chat", "대화", "자동응답"],
  "컴퓨터 비전/이미지AI": ["비전", "이미지", "인식", "분석", "영상", "시각", "카메라", "detection", "vision", "ocr"],
  "자연어처리/텍스트AI": ["자연어", "텍스트", "언어", "번역", "요약", "분석", "문서", "nlp", "text", "언어처리"],
  "음성인식/음성AI": ["음성", "voice", "speech", "stt", "tts", "인식", "합성", "발음", "소리"],
  "예측분석/데이터AI": ["예측", "분석", "데이터", "통계", "머신러닝", "learning", "예측모델", "빅데이터", "analytics"],
  "추천시스템/개인화AI": ["추천", "개인화", "맞춤", "추천시스템", "협업필터링", "개인화서비스", "recommendation"],
  "로봇/자동화AI": ["로봇", "자동화", "automation", "robot", "제어", "자동", "무인", "스마트팩토리"],
  "AI 플랫폼/인프라": ["플랫폼", "인프라", "클라우드", "서버", "gpu", "개발환경", "infrastructure"],
  "AI 교육/컨설팅": ["교육", "컨설팅", "워크숍", "교육과정", "consulting", "training", "학습"],
  "기타 AI 서비스": ["ai", "인공지능", "딥러닝", "머신러닝", "지능형", "스마트", "intelligent"]
};

// AI 서비스 유형 매칭 점수 계산 - 매칭된 서비스 유형도 반환
export const calculateServiceTypeScore = (
  demandContent: string, 
  supplierType: string, 
  demandKeywords: string, 
  supplierKeywords: string
): { score: number, matchedServiceTypes: string[] } => {
  const serviceKeywords = AI_SERVICE_KEYWORDS[supplierType] || [];
  if (serviceKeywords.length === 0) return { score: 0, matchedServiceTypes: [] };
  
  const allDemandText = `${demandContent} ${demandKeywords}`.toLowerCase();
  const allSupplierText = `${supplierType} ${supplierKeywords}`.toLowerCase();
  
  let matchScore = 0;
  const matchedServiceTypes: string[] = [];
  
  // 공급기업의 서비스 유형이 수요 내용과 매칭되는지 확인
  serviceKeywords.forEach(serviceKeyword => {
    if (allDemandText.includes(serviceKeyword)) {
      if (allSupplierText.includes(serviceKeyword)) {
        matchScore += 25; // 양쪽 모두에 포함된 경우 높은 점수
      } else {
        matchScore += 15; // 수요 내용에만 포함된 경우
      }
      
      if (!matchedServiceTypes.includes(serviceKeyword)) {
        matchedServiceTypes.push(serviceKeyword);
      }
    }
  });
  
  // 서비스 유형 자체가 매칭되는 경우 추가 점수
  if (allDemandText.includes(supplierType.toLowerCase())) {
    matchScore += 30;
    if (!matchedServiceTypes.includes(supplierType)) {
      matchedServiceTypes.push(supplierType);
    }
  }
  
  return {
    score: Math.min(matchScore, 100),
    matchedServiceTypes
  };
};
