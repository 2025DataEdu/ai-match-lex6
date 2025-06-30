
// 개선된 템플릿 기반 SQL 생성 - 단순하고 안전한 접근
export function generateQuickSQL(message: string): string | null {
  const lowerMessage = message.toLowerCase().trim();
  
  // 기본 검색 키워드 추출
  const keywords = lowerMessage.split(/\s+/).filter(word => word.length > 1);
  
  // AI 서비스별 특화 검색
  if (lowerMessage.includes('챗봇') || lowerMessage.includes('대화형')) {
    return `
    SELECT *, 80 as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%챗봇%' OR 유형 ILIKE '%대화형%' OR 유형 ILIKE '%AI%' 
           OR 세부설명 ILIKE '%챗봇%' OR 세부설명 ILIKE '%대화형%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
  }
  
  if (lowerMessage.includes('cctv') || lowerMessage.includes('영상') || lowerMessage.includes('감시') || lowerMessage.includes('모니터링')) {
    return `
    SELECT *, 80 as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%비전%' OR 유형 ILIKE '%이미지%' OR 유형 ILIKE '%영상%'
           OR 세부설명 ILIKE '%CCTV%' OR 세부설명 ILIKE '%감시%' OR 세부설명 ILIKE '%모니터링%'
           OR 세부설명 ILIKE '%영상%' OR 세부설명 ILIKE '%객체인식%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
  }
  
  if (lowerMessage.includes('음성') || lowerMessage.includes('stt') || lowerMessage.includes('tts')) {
    return `
    SELECT *, 80 as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%음성%' OR 세부설명 ILIKE '%음성%' OR 세부설명 ILIKE '%STT%' OR 세부설명 ILIKE '%TTS%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
  }
  
  // 일반 AI 검색
  if (lowerMessage.includes('ai') || lowerMessage.includes('인공지능')) {
    return `
    SELECT *, 70 as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%AI%' OR 유형 ILIKE '%인공지능%' 
           OR 세부설명 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
  }
  
  // 키워드 기반 일반 검색
  if (keywords.length > 0) {
    const firstKeyword = keywords[0].replace(/[^a-zA-Z0-9가-힣]/g, '');
    if (firstKeyword.length > 0) {
      return `
      SELECT *, 60 as relevance_score
      FROM 공급기업 
      WHERE (기업명 ILIKE '%${firstKeyword}%' OR 업종 ILIKE '%${firstKeyword}%' OR 세부설명 ILIKE '%${firstKeyword}%')
      ORDER BY relevance_score DESC, 등록일자 DESC 
      LIMIT 10`;
    }
  }
  
  return null;
}
