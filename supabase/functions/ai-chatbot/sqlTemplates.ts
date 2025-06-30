
// 템플릿 기반 빠른 SQL 생성 (개선된 버전)
import { AI_SERVICE_KEYWORDS } from './serviceTypeMapping.ts';

export function generateQuickSQL(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // AI 챗봇 관련 특별 처리 - 서비스 유형을 우선으로 검색
  if (lowerMessage.includes('챗봇') || lowerMessage.includes('대화형') || lowerMessage.includes('자연어')) {
    return `
    SELECT *, 
           CASE 
             WHEN 유형 ILIKE '%챗봇%' OR 유형 ILIKE '%대화형%' THEN 100
             WHEN 세부설명 ILIKE '%챗봇%' OR 세부설명 ILIKE '%대화형%' OR 세부설명 ILIKE '%자연어%' THEN 80
             WHEN 업종 ILIKE '%AI%' OR 업종 ILIKE '%인공지능%' THEN 60
             ELSE 40
           END as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%챗봇%' OR 유형 ILIKE '%대화형%' OR 유형 ILIKE '%AI%' 
           OR 세부설명 ILIKE '%챗봇%' OR 세부설명 ILIKE '%대화형%' OR 세부설명 ILIKE '%자연어%'
           OR 세부설명 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 20`;
  }
  
  // 컴퓨터 비전/이미지 AI 관련 (CCTV 포함)
  if (lowerMessage.includes('비전') || lowerMessage.includes('이미지') || lowerMessage.includes('영상') || 
      lowerMessage.includes('ocr') || lowerMessage.includes('cctv') || lowerMessage.includes('감시') || 
      lowerMessage.includes('모니터링') || lowerMessage.includes('객체인식')) {
    return `
    SELECT *, 
           CASE 
             WHEN 유형 ILIKE '%비전%' OR 유형 ILIKE '%이미지%' OR 유형 ILIKE '%영상%' THEN 100
             WHEN 세부설명 ILIKE '%비전%' OR 세부설명 ILIKE '%이미지%' OR 세부설명 ILIKE '%영상%' OR 
                  세부설명 ILIKE '%OCR%' OR 세부설명 ILIKE '%CCTV%' OR 세부설명 ILIKE '%감시%' OR 
                  세부설명 ILIKE '%모니터링%' OR 세부설명 ILIKE '%객체인식%' THEN 80
             WHEN 업종 ILIKE '%AI%' OR 업종 ILIKE '%인공지능%' THEN 60
             ELSE 40
           END as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%비전%' OR 유형 ILIKE '%이미지%' OR 유형 ILIKE '%영상%'
           OR 세부설명 ILIKE '%비전%' OR 세부설명 ILIKE '%이미지%' OR 세부설명 ILIKE '%영상%' 
           OR 세부설명 ILIKE '%OCR%' OR 세부설명 ILIKE '%CCTV%' OR 세부설명 ILIKE '%감시%'
           OR 세부설명 ILIKE '%모니터링%' OR 세부설명 ILIKE '%객체인식%'
           OR 세부설명 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 20`;
  }
  
  // 음성인식/음성AI 관련
  if (lowerMessage.includes('음성') || lowerMessage.includes('stt') || lowerMessage.includes('tts')) {
    return `
    SELECT *, 
           CASE 
             WHEN 유형 ILIKE '%음성%' OR 유형 ILIKE '%voice%' THEN 100
             WHEN 세부설명 ILIKE '%음성%' OR 세부설명 ILIKE '%STT%' OR 세부설명 ILIKE '%TTS%' THEN 80
             WHEN 업종 ILIKE '%AI%' OR 업종 ILIKE '%인공지능%' THEN 60
             ELSE 40
           END as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%음성%' OR 유형 ILIKE '%voice%' 
           OR 세부설명 ILIKE '%음성%' OR 세부설명 ILIKE '%STT%' OR 세부설명 ILIKE '%TTS%'
           OR 세부설명 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 20`;
  }
  
  // 금액 관련 쿼리 템플릿
  if (lowerMessage.includes('억') && (lowerMessage.includes('이상') || lowerMessage.includes('넘') || lowerMessage.includes('초과'))) {
    const matches = lowerMessage.match(/(\d+)억/);
    if (matches) {
      const amount = parseInt(matches[1]) * 10000; // 만원 단위로 변환
      return `SELECT * FROM 수요기관 WHERE 금액 >= ${amount} ORDER BY 금액 DESC LIMIT 20`;
    }
  }
  
  // 특허 관련 쿼리 템플릿
  if (lowerMessage.includes('특허')) {
    return `
    SELECT *, 
           CASE 
             WHEN 보유특허 IS NOT NULL AND 보유특허 != '' THEN 100
             ELSE 50
           END as relevance_score
    FROM 공급기업 
    WHERE 보유특허 IS NOT NULL AND 보유특허 != '' 
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 20`;
  }
  
  // 일반적인 AI 관련 쿼리 템플릿 - 서비스 유형 우선
  if (lowerMessage.includes('ai') || lowerMessage.includes('인공지능') || lowerMessage.includes('머신러닝')) {
    return `
    SELECT *, 
           CASE 
             WHEN 유형 ILIKE '%AI%' OR 유형 ILIKE '%인공지능%' THEN 100
             WHEN 세부설명 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%' OR 세부설명 ILIKE '%머신러닝%' THEN 80
             WHEN 업종 ILIKE '%AI%' OR 업종 ILIKE '%인공지능%' THEN 60
             ELSE 40
           END as relevance_score
    FROM 공급기업 
    WHERE (유형 ILIKE '%AI%' OR 유형 ILIKE '%인공지능%' 
           OR 세부설명 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%' OR 세부설명 ILIKE '%머신러닝%'
           OR 업종 ILIKE '%AI%' OR 업종 ILIKE '%인공지능%')
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 20`;
  }
  
  // 일반적인 키워드 검색 템플릿 - 서비스 유형 우선, SQL 인젝션 방지
  const keywords = lowerMessage.split(' ').filter(word => word.length > 1);
  if (keywords.length > 0) {
    // 특수문자 제거 및 안전한 키워드만 사용
    const safeKeywords = keywords.map(keyword => 
      keyword.replace(/[^a-zA-Z0-9가-힣]/g, '')
    ).filter(keyword => keyword.length > 0);
    
    if (safeKeywords.length === 0) return null;
    
    const typeConditions = safeKeywords.map(keyword => 
      `유형 ILIKE '%${keyword}%'`
    ).join(' OR ');
    
    const descriptionConditions = safeKeywords.map(keyword => 
      `(기업명 ILIKE '%${keyword}%' OR 업종 ILIKE '%${keyword}%' OR 세부설명 ILIKE '%${keyword}%')`
    ).join(' OR ');
    
    return `
    SELECT *, 
           CASE 
             WHEN (${typeConditions}) THEN 100
             WHEN (${descriptionConditions}) THEN 70
             ELSE 50
           END as relevance_score
    FROM 공급기업 
    WHERE (${typeConditions}) OR (${descriptionConditions})
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 20`;
  }
  
  return null;
}
