
// AI 서비스 유형별 키워드 매핑 (챗봇에서 사용)
export const AI_SERVICE_KEYWORDS: { [key: string]: string[] } = {
  "AI 챗봇/대화형AI": ["챗봇", "대화형", "자연어", "응답", "상담", "문의", "bot", "chat", "대화", "자동응답", "nlp"],
  "컴퓨터 비전/이미지AI": ["비전", "이미지", "인식", "분석", "영상", "시각", "카메라", "detection", "vision", "ocr", "얼굴인식"],
  "자연어처리/텍스트AI": ["자연어", "텍스트", "언어", "번역", "요약", "분석", "문서", "nlp", "text", "언어처리", "텍스트분석"],
  "음성인식/음성AI": ["음성", "voice", "speech", "stt", "tts", "인식", "합성", "발음", "소리", "음성처리"],
  "예측분석/데이터AI": ["예측", "분석", "데이터", "통계", "머신러닝", "learning", "예측모델", "빅데이터", "analytics", "데이터분석"],
  "추천시스템/개인화AI": ["추천", "개인화", "맞춤", "추천시스템", "협업필터링", "개인화서비스", "recommendation", "개인맞춤"],
  "로봇/자동화AI": ["로봇", "자동화", "automation", "robot", "제어", "자동", "무인", "스마트팩토리", "rpa"],
  "AI 플랫폼/인프라": ["플랫폼", "인프라", "클라우드", "서버", "gpu", "개발환경", "infrastructure", "ai플랫폼"],
  "AI 교육/컨설팅": ["교육", "컨설팅", "워크숍", "교육과정", "consulting", "training", "학습", "교육서비스"],
  "기타 AI 서비스": ["ai", "인공지능", "딥러닝", "머신러닝", "지능형", "스마트", "intelligent", "artificial"]
};

// 서비스 유형 매칭 점수를 계산하는 함수
export function calculateServiceTypeRelevance(query: string, serviceType: string, description: string): number {
  const queryLower = query.toLowerCase();
  const serviceTypeLower = serviceType.toLowerCase();
  const descriptionLower = description.toLowerCase();
  
  let score = 0;
  
  // 직접적인 서비스 유형 매칭 (최고 점수)
  if (serviceTypeLower.includes(queryLower) || queryLower.includes(serviceTypeLower)) {
    score += 100;
  }
  
  // 키워드 기반 매칭
  for (const [type, keywords] of Object.entries(AI_SERVICE_KEYWORDS)) {
    if (type === serviceType) {
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          score += 80;
          break; // 한 번 매칭되면 충분
        }
      }
      break;
    }
  }
  
  // 설명 내용에서 쿼리 키워드 매칭
  const queryWords = queryLower.split(' ').filter(word => word.length > 1);
  for (const word of queryWords) {
    if (descriptionLower.includes(word)) {
      score += 30;
    }
  }
  
  return Math.min(score, 100); // 최대 100점
}
