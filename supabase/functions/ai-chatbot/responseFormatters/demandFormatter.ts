
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedDemandResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `🏛️ **수요기관 검색 결과**\n\n'${query}'와 관련된 수요기관을 찾지 못했습니다.\n\n**검색 가능한 예시**:\n• "AI 도입을 원하는 기관 찾아줘"\n• "챗봇 구축 예정인 수요기관은?"\n• "CCTV 설치 계획이 있는 기관들"\n\n더 구체적인 검색어로 다시 시도해보세요.`;
  }

  let responseText = `🏛️ **수요기관 검색 결과**\n\n`;
  responseText += `총 ${results.length}개의 관련 수요기관을 찾았습니다.\n\n`;

  results.forEach((demand, index) => {
    responseText += `📋 **${index + 1}. ${demand.수요기관 || '기관명 없음'}**\n`;
    
    if (demand.유형) {
      responseText += `🔸 **유형**: ${demand.유형}\n`;
    }
    
    if (demand.수요내용) {
      const content = demand.수요내용.length > 120 
        ? demand.수요내용.substring(0, 120) + '...' 
        : demand.수요내용;
      responseText += `🔸 **수요 내용**: ${content}\n`;
    }
    
    if (demand.추출키워드 && demand.추출키워드.trim() !== '') {
      responseText += `🔸 **핵심 키워드**: ${demand.추출키워드}\n`;
    }
    
    if (demand.금액) {
      responseText += `🔸 **예산**: ${demand.금액.toLocaleString()}원\n`;
    }
    
    if (demand.시작일 && demand.종료일) {
      responseText += `🔸 **진행 기간**: ${demand.시작일} ~ ${demand.종료일}\n`;
    }
    
    if (demand.기타요구사항) {
      responseText += `🔸 **추가 요구사항**: ${demand.기타요구사항}\n`;
    }
    
    responseText += '\n';
  });

  responseText += '💼 관심 있는 수요기관이 있으시면 매칭 서비스를 이용해보세요!';
  
  return responseText;
}
