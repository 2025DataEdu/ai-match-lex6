
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedDemandResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `🏛️ **수요기관 검색 결과**\n\n'${query}'와 관련된 수요기관을 찾지 못했습니다.\n\n다른 키워드로 검색해보세요.`;
  }

  let responseText = `🏛️ **수요기관 검색 결과**\n\n`;
  responseText += `총 ${results.length}개의 관련 수요기관을 찾았습니다.\n\n`;

  results.forEach((demand, index) => {
    responseText += `${index + 1}. **${demand.수요기관 || '기관명 없음'}**\n`;
    
    // 추천 이유를 자연어로 설명
    const reasons = [];
    if (demand.유형) {
      reasons.push(`${demand.유형} 관련 수요`);
    }
    if (demand.추출키워드) {
      const keywords = demand.추출키워드.split(',').slice(0, 2);
      reasons.push(`${keywords.join(', ')} 기술 필요`);
    }
    if (demand.금액) {
      reasons.push(`예산 ${demand.금액.toLocaleString()}원`);
    }
    
    if (reasons.length > 0) {
      responseText += `   → ${reasons.join(', ')}로 관련성이 높습니다.\n`;
    }
    
    responseText += '\n';
  });

  return responseText;
}
