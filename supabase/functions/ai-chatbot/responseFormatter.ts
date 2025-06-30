
export function formatResponse(query: string, results: any[], error: any = null): string {
  if (error) {
    console.error('Response formatting error:', error);
    return `죄송합니다. 검색 중 오류가 발생했습니다.\n\n다른 키워드로 다시 검색해보시거나, 더 구체적인 질문을 해주세요.\n\n예시:\n- "AI 챗봇 개발 업체 찾아줘"\n- "CCTV 영상분석 업체 알려줘"\n- "음성인식 기술 보유 기업은?"`;
  }

  if (!results || results.length === 0) {
    return `'${query}'에 대한 검색 결과를 찾을 수 없습니다.\n\n다른 키워드로 검색해보세요:\n- AI 챗봇, 대화형 AI\n- CCTV, 영상분석, 모니터링\n- 음성인식, STT, TTS\n- 자연어처리, 텍스트분석`;
  }

  const queryLower = query.toLowerCase();
  let responseText = '';

  // 맞춤형 인사말
  if (queryLower.includes('챗봇') || queryLower.includes('대화형')) {
    responseText = `🤖 **AI 챗봇 개발 전문기업**을 찾아드렸습니다! (총 ${results.length}개)\n\n`;
  } else if (queryLower.includes('cctv') || queryLower.includes('영상') || queryLower.includes('감시')) {
    responseText = `📹 **AI CCTV/영상분석 전문기업**을 찾아드렸습니다! (총 ${results.length}개)\n\n`;
  } else if (queryLower.includes('음성') || queryLower.includes('stt') || queryLower.includes('tts')) {
    responseText = `🎤 **음성인식/음성AI 전문기업**을 찾아드렸습니다! (총 ${results.length}개)\n\n`;
  } else {
    responseText = `🔍 **'${query}' 검색 결과**를 찾아드렸습니다! (총 ${results.length}개)\n\n`;
  }

  // 결과 정렬 (관련성 점수 순)
  const sortedResults = results.sort((a, b) => {
    const scoreA = a.relevance_score || 0;
    const scoreB = b.relevance_score || 0;
    return scoreB - scoreA;
  });

  sortedResults.forEach((company, index) => {
    const companyName = company.기업명 || '기업명 없음';
    const serviceType = company.유형 || '서비스 유형 정보 없음';
    const industry = company.업종 || '업종 정보 없음';
    const description = company.세부설명 || '설명 없음';
    const website = company.기업홈페이지;
    const patents = company.보유특허;

    responseText += `**${index + 1}. ${companyName}**\n`;
    responseText += `🔸 **서비스 유형**: ${serviceType}\n`;
    responseText += `🔸 **업종**: ${industry}\n`;
    responseText += `🔸 **주요 서비스**: ${description.length > 80 ? description.substring(0, 80) + '...' : description}\n`;
    
    if (patents && patents.trim() !== '') {
      responseText += `🔸 **보유특허**: ${patents.length > 50 ? patents.substring(0, 50) + '...' : patents}\n`;
    }
    
    if (website && website.trim() !== '') {
      responseText += `🔸 **홈페이지**: ${website}\n`;
    }
    
    responseText += '\n';
  });

  // 맞춤형 추가 정보
  if (queryLower.includes('cctv') || queryLower.includes('영상')) {
    responseText += '\n💡 **AI CCTV 도입 시 체크포인트**\n';
    responseText += '✓ 실시간 영상처리 성능\n';
    responseText += '✓ 객체/얼굴 인식 정확도\n';
    responseText += '✓ 이상상황 자동 알림 기능\n';
    responseText += '✓ 기존 시스템과의 연동성\n';
  } else if (queryLower.includes('챗봇')) {
    responseText += '\n💡 **AI 챗봇 구축 시 체크포인트**\n';
    responseText += '✓ 자연어 이해 수준\n';
    responseText += '✓ 도메인 특화 학습 가능 여부\n';
    responseText += '✓ 다채널 연동 지원\n';
    responseText += '✓ 지속적인 학습 및 개선 체계\n';
  }

  responseText += '\n📞 더 자세한 정보나 맞춤 상담이 필요하시면 언제든 말씀해 주세요!';
  
  return responseText;
}

export function formatCachedResponse(query: string, cachedData: any[]): string {
  return formatResponse(query, cachedData) + '\n\n⚡ (빠른 검색 결과)';
}
