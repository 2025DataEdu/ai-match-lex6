
export async function generateSQLWithAI(message: string, openAIApiKey: string): Promise<string> {
  const schemaInfo = `
  데이터베이스 테이블 정보:
  
  1. 공급기업 테이블:
  - 공급기업일련번호 (text, primary key)
  - 아이디 (text)
  - 기업명 (text) [인덱스 최적화됨]
  - 업종 (text) [인덱스 최적화됨]
  - 유형 (text) [인덱스 최적화됨]
  - 세부설명 (text) [인덱스 최적화됨]
  - 보유특허 (text) [인덱스 최적화됨]
  - 기업홈페이지 (text)
  - 유튜브링크 (text)
  - 사용자명 (text)
  - 등록일자 (text)
  
  2. 수요기관 테이블:
  - 수요기관일련번호 (text, primary key)
  - 아이디 (text)
  - 수요기관 (text) [인덱스 최적화됨]
  - 부서명 (text)
  - 사용자명 (text)
  - 유형 (text) [인덱스 최적화됨]
  - 수요내용 (text) [인덱스 최적화됨]
  - 금액 (bigint, 만원 단위) [인덱스 최적화됨]
  - 시작일 (text)
  - 종료일 (text)
  - 기타요구사항 (text) [인덱스 최적화됨]
  - 등록일자 (text)
  
  최적화 가이드:
  - 텍스트 검색시 ILIKE '%키워드%' 사용 (최적화된 인덱스 활용)
  - 금액은 만원 단위 (1억원 = 10,000)
  - LIMIT으로 결과 제한 (기본 20개)
  `;

  const sqlGenerationPrompt = `당신은 PostgreSQL SQL 생성 전문가입니다.
  사용자의 자연어 질의를 분석하여 최적화된 SQL 쿼리를 생성해주세요.

  ${schemaInfo}

  사용자 질의: "${message}"

  규칙:
  1. SELECT 쿼리만 생성
  2. 텍스트 검색시 ILIKE '%키워드%' 사용
  3. 금액 관련 질의시 만원 단위 고려
  4. LIMIT으로 결과 제한 (기본 20개)
  5. 관련성 높은 결과부터 정렬

  오직 SQL 쿼리만 응답하세요.`;

  const sqlResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'user', content: sqlGenerationPrompt }
      ],
      temperature: 0.1,
      max_tokens: 200,
    }),
  });

  const sqlData = await sqlResponse.json();
  return sqlData.choices[0].message.content.trim();
}
