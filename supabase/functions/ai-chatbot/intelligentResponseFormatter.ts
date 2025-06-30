
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

  // 의도별 정확한 응답 처리
  switch (analysis.intent) {
    case 'statistics':
      return formatEnhancedStatisticsResponse(originalQuery, analysis, results);
    case 'supplier_search':
      return formatEnhancedSupplierResponse(originalQuery, analysis, results);
    case 'demand_search':
      return formatEnhancedDemandResponse(originalQuery, analysis, results);
    case 'matching_info':
      return formatMatchingInfoResponse(originalQuery, analysis, results);
    case 'general_info':
      return formatGeneralInfoResponse(originalQuery, analysis);
    default:
      return formatEnhancedSupplierResponse(originalQuery, analysis, results);
  }
}

function formatEnhancedStatisticsResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `📊 **통계 정보**\n\n현재 등록된 데이터가 없습니다.\n\n**이용 가능한 통계 질문**:\n• "공급기업이 총 몇 곳이야?"\n• "AI 챗봇 업체는 몇 개야?"\n• "수요기관은 총 몇 곳 등록되어 있어?"\n• "CCTV 관련 기업 수는?"`;
  }

  const statData = results[0];
  let responseText = `📊 **현재 데이터베이스 통계**\n\n`;
  
  // 전체 통계 표시
  responseText += `🏢 **전체 공급기업**: ${statData.totalSuppliers?.toLocaleString() || 0}곳\n`;
  responseText += `🏛️ **전체 수요기관**: ${statData.totalDemands?.toLocaleString() || 0}곳\n\n`;
  
  // 필터링된 통계가 있는 경우
  if (statData.filteredStats && statData.searchTerms && statData.searchTerms.length > 0) {
    const searchKeyword = statData.searchTerms.join(', ');
    responseText += `🎯 **'${searchKeyword}' 관련 세부 통계**:\n`;
    responseText += `• 관련 공급기업: ${statData.filteredStats.suppliers?.toLocaleString() || 0}곳\n`;
    responseText += `• 관련 수요기관: ${statData.filteredStats.demands?.toLocaleString() || 0}곳\n\n`;
    
    // 비율 계산
    if (statData.totalSuppliers > 0) {
      const supplierRatio = ((statData.filteredStats.suppliers / statData.totalSuppliers) * 100).toFixed(1);
      responseText += `📈 **비율**: 전체 공급기업 중 ${supplierRatio}%가 ${searchKeyword} 관련 기업입니다.\n\n`;
    }
  }
  
  responseText += `📋 **추가 확인 가능한 통계**:\n`;
  responseText += `• "AI 챗봇 관련 기업은 몇 곳이야?"\n`;
  responseText += `• "CCTV 영상분석 업체 수는?"\n`;
  responseText += `• "음성인식 기술 보유 기업 통계는?"\n`;
  responseText += `• "로봇 개발 수요가 있는 기관은 몇 곳이야?"\n\n`;
  responseText += `더 구체적인 분야별 통계가 필요하시면 말씀해 주세요!`;
  
  return responseText;
}

function formatEnhancedSupplierResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return formatNoResultsResponse(query, analysis);
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

function formatEnhancedDemandResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
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

function formatMatchingInfoResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  return `🤝 **매칭 서비스 안내**\n\n현재 AI 매칭 시스템을 통해 공급기업과 수요기관을 연결해드리고 있습니다.\n\n**매칭 서비스 특징**:\n• 키워드 기반 자동 매칭\n• 관련성 점수 제공\n• 상세한 기업/기관 정보 제공\n• 실시간 문의 시스템\n\n**이용 방법**:\n1. AI 매칭 페이지 방문\n2. 원하는 조건 설정\n3. 매칭 결과 확인\n4. 관심 기업/기관에 문의\n\n더 자세한 매칭 정보가 필요하시면 AI 매칭 페이지를 이용해주세요!`;
}

function formatGeneralInfoResponse(query: string, analysis: KeywordAnalysis): string {
  return `ℹ️ **안내**\n\n죄송합니다. '${query}'에 대한 직접적인 데이터는 보유하고 있지 않습니다.\n\n**현재 제공 가능한 정보**:\n• 공급기업 검색 (AI, 챗봇, CCTV 등)\n• 수요기관 정보 조회\n• 기업/기관 통계 정보\n• AI 매칭 서비스 안내\n\n**검색 예시**:\n• "AI 챗봇 개발 업체 찾아줘"\n• "공급기업이 총 몇 곳이야?"\n• "CCTV 설치 예정인 수요기관은?"\n• "매칭 서비스는 어떻게 이용해?"\n\n구체적인 검색어로 다시 질문해주시면 정확한 정보를 제공해드릴 수 있습니다.`;
}

function formatNoResultsResponse(query: string, analysis: KeywordAnalysis): string {
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

function formatErrorResponse(query: string, analysis: KeywordAnalysis): string {
  return `죄송합니다. '${query}' 검색 중 일시적인 오류가 발생했습니다.\n\n다시 시도해주시거나, 다른 방식으로 질문해주세요.\n\n**예시**:\n• "AI 챗봇 개발할 수 있는 업체 찾아줘"\n• "CCTV 영상분석 전문업체 알려줘"\n• "음성인식 기술 보유한 기업 추천해줘"`;
}

function addServiceSpecificAdvice(serviceType: string | null): string {
  if (!serviceType) return '';
  
  if (serviceType.includes('챗봇') || serviceType.includes('대화형')) {
    return '\n💡 **AI 챗봇 도입 시 확인사항**\n✓ 자연어 이해 정확도 및 학습 데이터\n✓ 기존 시스템 연동 가능성\n✓ 다국어 지원 및 커스터마이징\n✓ 유지보수 및 업데이트 정책\n';
  } else if (serviceType.includes('비전') || serviceType.includes('이미지') || serviceType.includes('CCTV')) {
    return '\n💡 **AI 비전 솔루션 도입 시 확인사항**\n✓ 실시간 처리 성능 및 정확도\n✓ 하드웨어 요구사항\n✓ 프라이버시 및 보안 정책\n✓ 기존 CCTV 시스템 호환성\n';
  }
  
  return '';
}
