
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';

export function formatIntelligentResponse(
  originalQuery: string, 
  analysis: KeywordAnalysis, 
  results: any[], 
  error: any = null
): string {
  if (error) {
    return formatErrorResponse(originalQuery, analysis);
  }

  if (!results || results.length === 0) {
    return formatNoResultsResponse(originalQuery, analysis);
  }

  return formatSuccessResponse(originalQuery, analysis, results);
}

function formatSuccessResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  const { primaryKeywords, serviceType, context } = analysis;
  
  let responseText = '';
  
  // 맞춤형 인사말 생성
  if (serviceType) {
    responseText = `🎯 **${serviceType} 전문기업**을 찾아드렸습니다!\n`;
  } else {
    responseText = `🔍 **'${primaryKeywords.join(', ')}' 관련 기업**을 찾아드렸습니다!\n`;
  }
  
  responseText += `총 ${results.length}개의 기업이 검색되었습니다.\n\n`;

  // 결과를 관련성 점수로 정렬
  const sortedResults = results.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

  sortedResults.forEach((company, index) => {
    const score = company.relevance_score || 50;
    const matchIndicator = score >= 80 ? '🎯' : score >= 70 ? '✨' : '📋';
    
    responseText += `${matchIndicator} **${index + 1}. ${company.기업명 || '기업명 없음'}**\n`;
    responseText += `🔸 **서비스 유형**: ${company.유형 || '정보 없음'}\n`;
    responseText += `🔸 **업종**: ${company.업종 || '정보 없음'}\n`;
    
    if (company.세부설명) {
      const description = company.세부설명.length > 100 
        ? company.세부설명.substring(0, 100) + '...' 
        : company.세부설명;
      responseText += `🔸 **주요 서비스**: ${description}\n`;
    }
    
    if (company.보유특허 && company.보유특허.trim() !== '') {
      responseText += `🔸 **보유특허**: ${company.보유특허.length > 60 ? company.보유특허.substring(0, 60) + '...' : company.보유특허}\n`;
    }
    
    if (company.기업홈페이지 && company.기업홈페이지.trim() !== '') {
      responseText += `🔸 **홈페이지**: ${company.기업홈페이지}\n`;
    }
    
    if (score >= 70) {
      responseText += `💡 **매칭도**: ${Math.round(score)}% (높은 연관성)\n`;
    }
    
    responseText += '\n';
  });

  // 맞춤형 추가 조언
  if (context.budget) {
    responseText += `\n💰 **예산 관련**: ${context.budget}을 고려하여 업체 문의 시 참고하세요.\n`;
  }
  
  if (context.timeline) {
    responseText += `⏰ **일정 관련**: ${context.timeline}을 업체와 상담 시 명확히 전달하세요.\n`;
  }

  // 검색된 서비스 유형별 맞춤 조언
  if (serviceType?.includes('챗봇') || serviceType?.includes('대화형')) {
    responseText += '\n💡 **AI 챗봇 도입 시 확인사항**\n';
    responseText += '✓ 자연어 이해 정확도 및 학습 데이터\n';
    responseText += '✓ 기존 시스템 연동 가능성\n';
    responseText += '✓ 다국어 지원 및 커스터마이징\n';
    responseText += '✓ 유지보수 및 업데이트 정책\n';
  } else if (serviceType?.includes('비전') || serviceType?.includes('이미지')) {
    responseText += '\n💡 **AI 비전 솔루션 도입 시 확인사항**\n';
    responseText += '✓ 실시간 처리 성능 및 정확도\n';
    responseText += '✓ 하드웨어 요구사항\n';
    responseText += '✓ 프라이버시 및 보안 정책\n';
    responseText += '✓ 기존 CCTV 시스템 호환성\n';
  }

  responseText += '\n📞 추가 정보가 필요하시면 언제든 문의해 주세요!';
  
  return responseText;
}

function formatNoResultsResponse(query: string, analysis: KeywordAnalysis): string {
  const { primaryKeywords, serviceType } = analysis;
  
  let response = `'${query}' 검색 결과를 찾을 수 없습니다.\n\n`;
  
  if (serviceType) {
    response += `**${serviceType}** 관련 기업을 찾고 계시는군요!\n\n`;
  }
  
  response += '다른 키워드로 검색해보세요:\n';
  
  if (primaryKeywords.length > 0) {
    response += `• **현재 키워드**: ${primaryKeywords.join(', ')}\n`;
  }
  
  response += `• **추천 키워드**: AI, 인공지능, 챗봇, CCTV, 영상분석, 음성인식\n`;
  response += `• **서비스 유형**: 대화형AI, 컴퓨터비전, 음성AI, 자연어처리\n\n`;
  response += '구체적인 요구사항을 말씀해주시면 더 정확한 결과를 제공해드릴 수 있습니다.';
  
  return response;
}

function formatErrorResponse(query: string, analysis: KeywordAnalysis): string {
  return `죄송합니다. '${query}' 검색 중 일시적인 오류가 발생했습니다.\n\n다시 시도해주시거나, 다른 방식으로 질문해주세요.\n\n예시:\n• "AI 챗봇 개발할 수 있는 업체 찾아줘"\n• "CCTV 영상분석 전문업체 알려줘"\n• "음성인식 기술 보유한 기업 추천해줘"`;
}
