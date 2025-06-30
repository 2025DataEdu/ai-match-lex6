
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';
import { addServiceSpecificAdvice } from './adviceProvider.ts';

export function formatEnhancedSupplierResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return formatNoSupplierResultsResponse(query, analysis);
  }

  const { primaryKeywords, serviceType } = analysis;
  
  let responseText = '';
  
  // 맞춤형 인사말 생성
  if (serviceType) {
    responseText = `🎯 **${serviceType} 전문기업**을 찾아드렸습니다!\n`;
  } else if (primaryKeywords.length > 0) {
    responseText = `🔍 **'${primaryKeywords.join(', ')}' 관련 기업**을 찾아드렸습니다!\n`;
  } else {
    responseText = `🏢 **추천 기업**을 찾아드렸습니다!\n`;
  }
  
  responseText += `총 ${results.length}개의 관련성 높은 기업을 선별했습니다.\n\n`;

  // 관련성 점수 기준으로 정렬된 결과 표시
  results.forEach((company, index) => {
    const score = company.relevance_score || 50;
    const matchIndicator = score >= 85 ? '🎯' : score >= 70 ? '✨' : score >= 60 ? '📋' : '🏢';
    
    responseText += `${matchIndicator} **${index + 1}. ${company.기업명 || '기업명 없음'}**\n`;
    
    if (company.유형) {
      responseText += `🔸 **서비스 유형**: ${company.유형}\n`;
    }
    
    if (company.업종) {
      responseText += `🔸 **업종**: ${company.업종}\n`;
    }
    
    if (company.세부설명) {
      const description = company.세부설명.length > 120 
        ? company.세부설명.substring(0, 120) + '...' 
        : company.세부설명;
      responseText += `🔸 **주요 서비스**: ${description}\n`;
    }
    
    if (company.보유특허 && company.보유특허.trim() !== '') {
      responseText += `🔸 **보유특허**: ${company.보유특허.length > 80 ? company.보유특허.substring(0, 80) + '...' : company.보유특허}\n`;
    }
    
    if (company.추출키워드 && company.추출키워드.trim() !== '') {
      responseText += `🔸 **핵심기술**: ${company.추출키워드}\n`;
    }
    
    if (company.기업홈페이지 && company.기업홈페이지.trim() !== '') {
      responseText += `🔸 **홈페이지**: ${company.기업홈페이지}\n`;
    }
    
    if (score >= 80) {
      responseText += `💡 **매칭도**: ${Math.round(score)}% (높은 연관성)\n`;
    } else if (score >= 60) {
      responseText += `💡 **매칭도**: ${Math.round(score)}% (보통 연관성)\n`;
    }
    
    responseText += '\n';
  });

  // 추가 조언 제공
  responseText += addServiceSpecificAdvice(serviceType);
  responseText += '\n📞 추가 정보가 필요하시면 언제든 문의해 주세요!';
  
  return responseText;
}

function formatNoSupplierResultsResponse(query: string, analysis: KeywordAnalysis): string {
  const { primaryKeywords, serviceType } = analysis;
  
  let response = `🔍 **'${query}' 검색 결과**\n\n`;
  response += `현재 데이터베이스에서 직접적으로 일치하는 기업을 찾지 못했습니다.\n\n`;
  
  if (serviceType) {
    response += `**${serviceType}** 관련 기업을 찾고 계시는군요!\n\n`;
  }
  
  response += '**검색 팁**:\n';
  
  if (primaryKeywords.length > 0) {
    response += `• **현재 키워드**: ${primaryKeywords.join(', ')}\n`;
  }
  
  response += `• **추천 검색어**: \n`;
  response += `  - AI, 인공지능, 챗봇\n`;
  response += `  - CCTV, 영상분석, 모니터링\n`;
  response += `  - 음성인식, 자연어처리\n`;
  response += `  - 데이터분석, 머신러닝\n\n`;
  
  response += '**다시 시도해보세요**:\n';
  response += '• "AI 챗봇 개발업체 찾아줘"\n';
  response += '• "영상분석 전문기업 알려줘"\n';
  response += '• "음성인식 기술 회사 추천해줘"\n\n';
  
  response += '더 구체적인 요구사항을 말씀해주시면 정확한 결과를 제공해드릴 수 있습니다.';
  
  return response;
}
