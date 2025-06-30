
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedDemandResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `🏛️ **수요기관 검색 결과**\n\n'${query}'와 관련된 수요기관을 찾지 못했습니다.\n\n다른 키워드로 검색해보세요.`;
  }

  let responseText = `🏛️ **수요기관 검색 결과**\n\n`;
  responseText += `${results.length}개의 관련 수요기관을 찾았습니다.\n\n`;

  results.forEach((demand, index) => {
    responseText += `${index + 1}. **${demand.수요기관 || '기관명 없음'}**\n`;
    
    if (demand.수요내용) {
      const content = demand.수요내용.length > 100 
        ? demand.수요내용.substring(0, 100) + '...' 
        : demand.수요내용;
      responseText += `   수요내용: ${content}\n`;
    }
    if (demand.금액) {
      responseText += `   예산: ${demand.금액.toLocaleString()}원\n`;
    }
    
    responseText += '\n';
  });

  return responseText;
}
