
// AI 서비스 유형별 키워드 매핑 (단순화된 버전)
export const AI_SERVICE_KEYWORDS: { [key: string]: string[] } = {
  "AI 챗봇/대화형AI": ["챗봇", "대화형", "자연어", "bot", "chat", "대화", "자동응답"],
  "컴퓨터 비전/이미지AI": ["비전", "이미지", "영상", "CCTV", "감시", "모니터링", "객체인식", "얼굴인식"],
  "자연어처리/텍스트AI": ["자연어", "텍스트", "언어", "번역", "요약", "문서분석"],
  "음성인식/음성AI": ["음성", "voice", "speech", "stt", "tts", "음성인식", "음성합성"],
  "예측분석/데이터AI": ["예측", "분석", "데이터", "머신러닝", "빅데이터", "analytics"],
  "추천시스템/개인화AI": ["추천", "개인화", "맞춤", "추천시스템"],
  "로봇/자동화AI": ["로봇", "자동화", "automation", "robot", "rpa"],
  "기타 AI 서비스": ["ai", "인공지능", "딥러닝", "지능형", "스마트"]
};

// 간단한 키워드 매칭 함수
export function getRelevantServiceTypes(query: string): string[] {
  const queryLower = query.toLowerCase();
  const relevantTypes: string[] = [];
  
  for (const [serviceType, keywords] of Object.entries(AI_SERVICE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword)) {
        relevantTypes.push(serviceType);
        break;
      }
    }
  }
  
  return relevantTypes;
}
