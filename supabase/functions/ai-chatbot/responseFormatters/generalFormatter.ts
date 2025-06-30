
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatMatchingInfoResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  return `🤝 **매칭 서비스 안내**\n\n현재 AI 매칭 시스템을 통해 공급기업과 수요기관을 연결해드리고 있습니다.\n\n**매칭 서비스 특징**:\n• 키워드 기반 자동 매칭\n• 관련성 점수 제공\n• 상세한 기업/기관 정보 제공\n• 실시간 문의 시스템\n\n**이용 방법**:\n1. AI 매칭 페이지 방문\n2. 원하는 조건 설정\n3. 매칭 결과 확인\n4. 관심 기업/기관에 문의\n\n더 자세한 매칭 정보가 필요하시면 AI 매칭 페이지를 이용해주세요!`;
}

export function formatGeneralInfoResponse(query: string, analysis: KeywordAnalysis): string {
  return `ℹ️ **안내**\n\n죄송합니다. '${query}'에 대한 직접적인 데이터는 보유하고 있지 않습니다.\n\n**현재 제공 가능한 정보**:\n• 공급기업 검색 (AI, 챗봇, CCTV 등)\n• 수요기관 정보 조회\n• 기업/기관 통계 정보\n• AI 매칭 서비스 안내\n\n**검색 예시**:\n• "AI 챗봇 개발 업체 찾아줘"\n• "공급기업이 총 몇 곳이야?"\n• "CCTV 설치 예정인 수요기관은?"\n• "매칭 서비스는 어떻게 이용해?"\n\n구체적인 검색어로 다시 질문해주시면 정확한 정보를 제공해드릴 수 있습니다.`;
}

export function formatErrorResponse(query: string, analysis: KeywordAnalysis): string {
  return `죄송합니다. '${query}' 검색 중 일시적인 오류가 발생했습니다.\n\n다시 시도해주시거나, 다른 방식으로 질문해주세요.\n\n**예시**:\n• "AI 챗봇 개발할 수 있는 업체 찾아줘"\n• "CCTV 영상분석 전문업체 알려줘"\n• "음성인식 기술 보유한 기업 추천해줘"`;
}
