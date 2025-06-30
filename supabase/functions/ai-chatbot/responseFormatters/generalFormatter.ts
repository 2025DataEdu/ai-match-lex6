
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatMatchingInfoResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  return `🤝 **매칭 서비스 안내**\n\nAI 매칭 시스템을 통해 공급기업과 수요기관을 연결해드립니다.\n\n매칭 페이지에서 원하는 조건을 설정하고 결과를 확인하세요.`;
}

export function formatGeneralInfoResponse(query: string, analysis: KeywordAnalysis): string {
  return `ℹ️ **안내**\n\n'${query}'에 대한 정보를 찾지 못했습니다.\n\n**검색 가능한 내용**:\n• 공급기업 검색: "AI 개발 업체는?"\n• 수요기관 검색: "챗봇 도입 예정 기관은?"\n• 통계 정보: "공급기업이 총 몇 곳이야?"\n\n구체적인 키워드로 다시 질문해주세요.`;
}

export function formatErrorResponse(query: string, analysis: KeywordAnalysis): string {
  return `죄송합니다. '${query}' 검색 중 오류가 발생했습니다.\n\n다시 시도해주세요.`;
}
