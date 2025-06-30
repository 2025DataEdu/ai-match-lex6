
export function formatResponse(query: string, results: any[], error: any = null): string {
  if (error) {
    return `죄송합니다. 검색 중 오류가 발생했습니다: ${error.message}`;
  }

  if (!results || results.length === 0) {
    return `'${query}'에 대한 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해보시거나 더 구체적인 질문을 해주세요.`;
  }

  const queryLower = query.toLowerCase();
  let responseText = '';

  // AI 서비스 유형별 맞춤 응답 생성
  if (queryLower.includes('챗봇') || queryLower.includes('대화형')) {
    responseText = `AI 챗봇 개발이 가능한 공급기업을 찾았습니다 (총 ${results.length}개):\n\n`;
  } else if (queryLower.includes('비전') || queryLower.includes('이미지') || queryLower.includes('영상')) {
    responseText = `컴퓨터 비전/이미지 AI 개발이 가능한 공급기업을 찾았습니다 (총 ${results.length}개):\n\n`;
  } else if (queryLower.includes('음성') || queryLower.includes('stt') || queryLower.includes('tts')) {
    responseText = `음성인식/음성 AI 개발이 가능한 공급기업을 찾았습니다 (총 ${results.length}개):\n\n`;
  } else if (queryLower.includes('자연어') || queryLower.includes('텍스트')) {
    responseText = `자연어처리/텍스트 AI 개발이 가능한 공급기업을 찾았습니다 (총 ${results.length}개):\n\n`;
  } else {
    responseText = `'${query}' 검색 결과 (총 ${results.length}개):\n\n`;
  }

  // 결과를 관련성 점수 순으로 정렬 (이미 DB에서 정렬되어 오지만 확실히 하기 위해)
  const sortedResults = results.sort((a, b) => {
    const scoreA = a.relevance_score || 0;
    const scoreB = b.relevance_score || 0;
    return scoreB - scoreA;
  });

  sortedResults.forEach((company, index) => {
    const companyName = company.기업명 || '기업명 없음';
    const serviceType = company.유형 || '유형 정보 없음';
    const industry = company.업종 || '업종 정보 없음';
    const description = company.세부설명 || '설명 없음';
    const website = company.기업홈페이지;
    const patents = company.보유특허;
    const relevanceScore = company.relevance_score;

    responseText += `**${index + 1}. ${companyName}**\n`;
    responseText += `🔹 **서비스 유형**: ${serviceType}\n`;
    responseText += `🔹 **업종**: ${industry}\n`;
    responseText += `🔹 **세부설명**: ${description.length > 100 ? description.substring(0, 100) + '...' : description}\n`;
    
    if (patents && patents.trim() !== '') {
      responseText += `🔹 **보유특허**: ${patents}\n`;
    }
    
    if (website && website.trim() !== '') {
      responseText += `🔹 **홈페이지**: ${website}\n`;
    }

    if (relevanceScore) {
      responseText += `🔹 **매칭도**: ${relevanceScore}점\n`;
    }
    
    responseText += '\n';
  });

  // 추가 안내 메시지
  if (queryLower.includes('챗봇')) {
    responseText += '\n💡 **AI 챗봇 개발 시 고려사항:**\n';
    responseText += '- 자연어 처리 기술 수준\n';
    responseText += '- 도메인별 특화 기능\n';
    responseText += '- 다국어 지원 여부\n';
    responseText += '- API 연동 및 확장성\n';
  }

  responseText += '\n더 자세한 정보가 필요하시면 구체적인 요구사항을 말씀해 주세요!';
  
  return responseText;
}

export function formatCachedResponse(query: string, cachedData: any[]): string {
  return formatResponse(query, cachedData) + '\n\n(캐시된 결과)';
}
