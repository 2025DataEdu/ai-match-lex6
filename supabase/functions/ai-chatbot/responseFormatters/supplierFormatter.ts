
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedSupplierResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    // 검색한 키워드와 서비스 타입 표시
    const searchTerms = [];
    if (analysis.serviceType) searchTerms.push(analysis.serviceType);
    if (analysis.primaryKeywords && analysis.primaryKeywords.length > 0) {
      searchTerms.push(...analysis.primaryKeywords);
    }
    
    let responseText = `🏢 **공급기업 검색 결과**\n\n`;
    
    if (searchTerms.length > 0) {
      responseText += `'${searchTerms.join(', ')}'와 관련된 공급기업을 찾지 못했습니다.\n\n`;
      responseText += `**검색된 키워드**: ${searchTerms.join(', ')}\n`;
      responseText += `현재 데이터베이스에 해당 분야의 기업 정보가 없습니다.\n\n`;
      
      // 특정 분야별 안내 메시지
      if (analysis.serviceType === '컴퓨터비전/이미지AI' || searchTerms.some(term => ['cctv', 'CCTV', '비전', '영상', '이미지'].includes(term))) {
        responseText += `**CCTV/영상 AI 분야 검색 팁**:\n`;
        responseText += `• "비전 AI", "영상분석", "객체인식" 등의 키워드로 검색해보세요\n`;
        responseText += `• "감시시스템", "모니터링 솔루션" 등으로도 검색 가능합니다`;
      } else if (analysis.serviceType === '로봇/자동화AI' || searchTerms.some(term => ['로봇', '자동화'].includes(term))) {
        responseText += `**로봇/자동화 분야 검색 팁**:\n`;
        responseText += `• "자동화 시스템", "RPA", "무인화" 등의 키워드로 검색해보세요`;
      } else {
        responseText += `다른 관련 키워드로 다시 검색해보세요.`;
      }
    } else {
      responseText += `'${query}'와 관련된 공급기업을 찾지 못했습니다.\n\n`;
      responseText += `구체적인 기술이나 서비스 키워드를 포함해서 다시 검색해보세요.`;
    }
    
    return responseText;
  }

  let responseText = `🏢 **공급기업 검색 결과**\n\n`;
  responseText += `총 ${results.length}개의 관련 기업을 찾았습니다.\n\n`;

  results.forEach((supplier, index) => {
    responseText += `${index + 1}. **${supplier.기업명 || '기업명 없음'}**\n`;
    
    // 추천 이유를 자연어로 설명
    const reasons = [];
    if (supplier.유형) {
      reasons.push(`${supplier.유형} 전문`);
    }
    if (supplier.업종) {
      reasons.push(`${supplier.업종} 분야`);
    }
    if (supplier.추출키워드) {
      const keywords = supplier.추출키워드.split(',').slice(0, 2);
      reasons.push(`${keywords.join(', ')} 기술 보유`);
    }
    if (supplier.보유특허) {
      reasons.push('관련 특허 보유');
    }
    
    if (reasons.length > 0) {
      responseText += `   → ${reasons.join(', ')}하여 적합합니다.\n`;
    }
    
    responseText += '\n';
  });

  return responseText;
}
