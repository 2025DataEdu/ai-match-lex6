
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedSupplierResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `🏢 **공급기업 검색 결과**\n\n'${query}'와 관련된 공급기업을 찾지 못했습니다.\n\n키워드를 바꿔서 다시 검색해보세요.`;
  }

  let responseText = `🏢 **공급기업 검색 결과**\n\n`;
  responseText += `'${query}'와 관련된 **${results.length}개의 공급기업**을 찾았습니다.\n\n`;

  results.forEach((supplier, index) => {
    responseText += `**${index + 1}. ${supplier.기업명 || '기업명 없음'}**\n`;
    
    if (supplier.유형) {
      responseText += `🔧 AI 유형: ${supplier.유형}\n`;
    }
    
    if (supplier.업종) {
      responseText += `🏭 업종: ${supplier.업종}\n`;
    }
    
    if (supplier.세부설명) {
      const description = supplier.세부설명.length > 120 
        ? supplier.세부설명.substring(0, 120) + '...' 
        : supplier.세부설명;
      responseText += `📝 설명: ${description}\n`;
    }
    
    if (supplier.기업홈페이지) {
      responseText += `🌐 홈페이지: ${supplier.기업홈페이지}\n`;
    }
    
    responseText += '\n';
  });

  return responseText;
}
