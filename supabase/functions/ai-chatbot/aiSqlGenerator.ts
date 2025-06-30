
export async function generateSQLWithAI(message: string, openAIApiKey: string): Promise<string> {
  const sqlGenerationPrompt = `당신은 PostgreSQL SQL 생성 전문가입니다.
  사용자의 질의를 분석하여 공급기업 테이블에서 검색하는 SELECT 쿼리를 생성해주세요.

  테이블 정보:
  - 공급기업 테이블 컬럼: 기업명, 업종, 유형(AI 서비스 유형), 세부설명, 보유특허, 기업홈페이지, 공급기업일련번호

  사용자 질의: "${message}"

  규칙:
  1. SELECT 쿼리만 생성 (다른 SQL 명령어 금지)
  2. ILIKE '%키워드%' 사용으로 부분 매칭
  3. 여러 컬럼에서 OR 조건으로 검색
  4. relevance_score를 계산해서 포함 (CASE WHEN 사용)
  5. ORDER BY relevance_score DESC, 등록일자 DESC
  6. LIMIT 10
  7. 한국어 키워드는 정확히 매칭

  예시:
  SELECT *, 
    CASE 
      WHEN 유형 ILIKE '%챗봇%' THEN 90
      WHEN 세부설명 ILIKE '%챗봇%' THEN 80
      WHEN 기업명 ILIKE '%챗봇%' THEN 70
      ELSE 60
    END as relevance_score
  FROM 공급기업 
  WHERE (유형 ILIKE '%챗봇%' OR 세부설명 ILIKE '%챗봇%' OR 기업명 ILIKE '%챗봇%')
  ORDER BY relevance_score DESC, 등록일자 DESC 
  LIMIT 10

  오직 SQL 쿼리만 응답하세요.`;

  try {
    const sqlResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: sqlGenerationPrompt }
        ],
        temperature: 0.1,
        max_tokens: 400,
      }),
    });

    if (!sqlResponse.ok) {
      throw new Error(`OpenAI API error: ${sqlResponse.status}`);
    }

    const sqlData = await sqlResponse.json();
    let generatedSQL = sqlData.choices[0].message.content.trim();
    
    // SQL 정제
    generatedSQL = generatedSQL
      .replace(/```sql/g, '')
      .replace(/```/g, '')
      .trim();
    
    // SELECT로 시작하는지 확인
    if (!generatedSQL.toUpperCase().startsWith('SELECT')) {
      throw new Error('Generated query is not a SELECT statement');
    }
    
    console.log('Generated SQL:', generatedSQL);
    return generatedSQL;
    
  } catch (error) {
    console.error('Error generating SQL with AI:', error);
    
    // 오류 시 기본 쿼리 반환
    const keywords = message.split(/\s+/).filter(word => word.length > 1).slice(0, 3);
    const searchConditions = keywords.map(keyword => 
      `유형 ILIKE '%${keyword}%' OR 세부설명 ILIKE '%${keyword}%' OR 기업명 ILIKE '%${keyword}%'`
    ).join(' OR ');
    
    return `
    SELECT *, 60 as relevance_score
    FROM 공급기업 
    WHERE ${searchConditions || '세부설명 IS NOT NULL'}
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
  }
}
