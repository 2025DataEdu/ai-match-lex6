
export async function generateSQLWithAI(message: string, openAIApiKey: string): Promise<string> {
  const schemaInfo = `
  데이터베이스 테이블 정보:
  
  1. 공급기업 테이블:
  - 공급기업일련번호 (text, primary key)
  - 아이디 (text)
  - 기업명 (text) [인덱스 최적화됨]
  - 업종 (text) [인덱스 최적화됨]
  - 유형 (text) [인덱스 최적화됨] - AI 서비스 유형 (AI 챗봇/대화형AI, 컴퓨터 비전/이미지AI 등)
  - 세부설명 (text) [인덱스 최적화됨]
  - 보유특허 (text) [인덱스 최적화됨]
  - 기업홈페이지 (text)
  - 유튜브링크 (text)
  - 사용자명 (text)
  - 등록일자 (text)
  - 추출키워드 (text) [AI 매칭용 키워드]
  
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
  - 추출키워드 (text) [AI 매칭용 키워드]
  
  AI 서비스 유형별 우선순위:
  - "AI 챗봇/대화형AI": 챗봇, 대화형AI, 자연어처리 관련
  - "컴퓨터 비전/이미지AI": 이미지 인식, 영상 분석, OCR 관련
  - "자연어처리/텍스트AI": 텍스트 분석, 번역, 문서 처리 관련
  - "음성인식/음성AI": 음성 처리, STT, TTS 관련
  - "예측분석/데이터AI": 데이터 분석, 머신러닝, 예측 모델 관련
  
  최적화 가이드:
  - AI 서비스 검색시 '유형' 컬럼을 최우선으로 활용
  - 텍스트 검색시 ILIKE '%키워드%' 사용 (최적화된 인덱스 활용)
  - 금액은 만원 단위 (1억원 = 10,000)
  - CASE문을 사용하여 관련성 점수 계산 후 정렬
  - LIMIT으로 결과 제한 (기본 20개)
  `;

  const sqlGenerationPrompt = `당신은 PostgreSQL SQL 생성 전문가입니다.
  사용자의 자연어 질의를 분석하여 AI 서비스 유형 중심의 최적화된 SQL 쿼리를 생성해주세요.

  ${schemaInfo}

  사용자 질의: "${message}"

  규칙:
  1. SELECT 쿼리만 생성
  2. AI 서비스 관련 질의의 경우 '유형' 컬럼을 최우선으로 매칭
  3. CASE문을 사용하여 관련성 점수(relevance_score) 계산
  4. 서비스 유형 매칭 > 세부설명 매칭 > 업종 매칭 순으로 우선순위 부여
  5. 텍스트 검색시 ILIKE '%키워드%' 사용
  6. 금액 관련 질의시 만원 단위 고려
  7. ORDER BY relevance_score DESC, 등록일자 DESC
  8. LIMIT으로 결과 제한 (기본 20개)

  예시:
  - "AI 챗봇 개발" → 유형에서 '챗봇' 매칭을 최우선으로 처리
  - "이미지 인식" → 유형에서 '비전' 또는 '이미지' 매칭을 최우선으로 처리

  오직 SQL 쿼리만 응답하세요.`;

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
      max_tokens: 300,
    }),
  });

  const sqlData = await sqlResponse.json();
  return sqlData.choices[0].message.content.trim();
}
