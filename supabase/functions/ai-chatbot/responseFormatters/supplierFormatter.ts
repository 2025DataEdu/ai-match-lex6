
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedSupplierResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    let responseText = `🏢 **공급기업 검색 결과**\n\n`;
    responseText += `'${query}'와 관련된 공급기업을 찾지 못했습니다.\n\n`;
    responseText += `다른 키워드로 검색해보세요.`;
    return responseText;
  }

  let responseText = `🏢 **공급기업 검색 결과**\n\n`;
  responseText += `${results.length}개의 관련 기업을 찾았습니다.\n\n`;

  results.forEach((supplier, index) => {
    responseText += `${index + 1}. **${supplier.기업명 || '기업명 없음'}**\n`;
    
    if (supplier.유형) {
      responseText += `   유형: ${supplier.유형}\n`;
    }
    if (supplier.세부설명) {
      const description = supplier.세부설명.length > 100 
        ? supplier.세부설명.substring(0, 100) + '...' 
        : supplier.세부설명;
      responseText += `   설명: ${description}\n`;
    }
    
    responseText += '\n';
  });

  return responseText;
}
