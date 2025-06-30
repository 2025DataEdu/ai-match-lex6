
export async function generateSQLWithAI(message: string, openAIApiKey: string): Promise<string> {
  const sqlGenerationPrompt = `당신은 PostgreSQL SQL 생성 전문가입니다.
  사용자의 질의를 분석하여 공급기업 테이블에서 검색하는 SELECT 쿼리를 생성해주세요.

  테이블 정보:
  - 공급기업 테이블: 기업명, 업종, 유형(AI 서비스 유형), 세부설명, 보유특허, 기업홈페이지

  사용자 질의: "${message}"

  규칙:
  1. SELECT 쿼리만 생성
  2. ILIKE '%키워드%' 사용
  3. ORDER BY relevance_score DESC, 등록일자 DESC
  4. LIMIT 10
  5. relevance_score는 고정값 70으로 설정

  예시:
  SELECT *, 70 as relevance_score
  FROM 공급기업 
  WHERE 세부설명 ILIKE '%키워드%'
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
        max_tokens: 200,
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
    
    return generatedSQL;
  } catch (error) {
    console.error('Error generating SQL with AI:', error);
    
    // 오류 시 기본 쿼리 반환
    return `
    SELECT *, 50 as relevance_score
    FROM 공급기업 
    WHERE 세부설명 IS NOT NULL
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
  }
}
