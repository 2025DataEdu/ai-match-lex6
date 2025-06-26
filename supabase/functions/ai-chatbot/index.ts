
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Processing chatbot message:', message);

    // 데이터베이스 스키마 정보
    const schemaInfo = `
    데이터베이스 테이블 정보:
    
    1. 공급기업 테이블:
    - 공급기업일련번호 (text, primary key)
    - 아이디 (text)
    - 기업명 (text)
    - 업종 (text)
    - 유형 (text)
    - 세부설명 (text)
    - 보유특허 (text)
    - 기업홈페이지 (text)
    - 유튜브링크 (text)
    - 사용자명 (text)
    - 관심여부 (text)
    - 문의여부 (text)
    - 등록일자 (text)
    
    2. 수요기관 테이블:
    - 수요기관일련번호 (text, primary key)
    - 아이디 (text)
    - 수요기관 (text)
    - 부서명 (text)
    - 사용자명 (text)
    - 유형 (text)
    - 수요내용 (text)
    - 금액 (bigint, 만원 단위)
    - 시작일 (text)
    - 종료일 (text)
    - 기타요구사항 (text)
    - 관심여부 (text)
    - 문의일자 (text)
    - 등록일자 (text)
    
    3. 회원관리 테이블:
    - 아이디 (text, primary key)
    - 이름 (text)
    - 이메일 (text)
    - 기업명 (text)
    - 부서명 (text)
    - 연락처 (text)
    - 유형 (text)
    - 등록일자 (date)
    
    주의사항:
    - 금액은 만원 단위입니다 (1억원 = 10,000)
    - LIKE 검색시 ILIKE를 사용하세요 (대소문자 구분 없음)
    - 텍스트 검색시 '%키워드%' 형태로 사용하세요
    `;

    // 1단계: GPT에게 SQL 생성 요청
    const sqlGenerationPrompt = `당신은 PostgreSQL SQL 생성 전문가입니다.
    사용자의 자연어 질의를 분석하여 적절한 SQL 쿼리를 생성해주세요.

    ${schemaInfo}

    사용자 질의: "${message}"

    규칙:
    1. 오직 SELECT 쿼리만 생성하세요
    2. 테이블명과 컬럼명을 정확히 사용하세요
    3. 한국어 검색시 ILIKE '%키워드%' 사용
    4. 금액 관련 질의시 만원 단위임을 고려하세요
    5. 복잡한 질의는 JOIN을 활용하세요
    6. LIMIT을 적절히 사용하여 결과를 제한하세요

    응답 형식: 
    SQL: [생성된 SQL 쿼리만]
    `;

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
        max_tokens: 500,
      }),
    });

    const sqlData = await sqlResponse.json();
    const generatedResponse = sqlData.choices[0].message.content;
    
    // SQL 추출
    let sqlQuery = '';
    const sqlMatch = generatedResponse.match(/SQL:\s*(.+?)(?:\n|$)/s);
    if (sqlMatch) {
      sqlQuery = sqlMatch[1].trim();
    } else {
      // SQL: 라벨이 없으면 전체 응답을 SQL로 간주
      sqlQuery = generatedResponse.trim();
    }

    console.log('Generated SQL:', sqlQuery);

    // 2단계: SQL 실행
    let queryResults = [];
    let queryError = null;

    try {
      // SQL 쿼리를 RPC로 실행
      const { data, error } = await supabase.rpc('execute_dynamic_query', {
        query_text: sqlQuery
      });

      if (error) {
        console.error('SQL execution error:', error);
        queryError = error;
      } else {
        queryResults = data || [];
        console.log(`SQL execution successful: ${queryResults.length} results`);
      }
    } catch (error) {
      console.error('SQL execution error:', error);
      queryError = error;
    }

    // 3단계: 결과를 GPT에게 전달하여 자연어 응답 생성
    let finalPrompt = '';
    
    if (queryError) {
      finalPrompt = `SQL 쿼리 실행 중 오류가 발생했습니다.
      사용자 질의: "${message}"
      생성된 SQL: ${sqlQuery}
      오류: ${queryError.message}
      
      사용자에게 친근하고 도움이 되는 방식으로 오류를 설명하고, 다른 방법으로 질문해달라고 안내해주세요.`;
    } else if (queryResults.length === 0) {
      finalPrompt = `사용자 질의: "${message}"
      SQL 실행 결과: 결과가 없습니다.
      
      결과가 없다는 것을 친근하게 알려주고, 다른 키워드로 검색해볼 것을 제안해주세요.`;
    } else {
      finalPrompt = `사용자 질의: "${message}"
      SQL 실행 결과:
      ${JSON.stringify(queryResults, null, 2)}
      
      위 데이터를 바탕으로 사용자의 질문에 대한 친근하고 상세한 답변을 한국어로 작성해주세요.
      
      답변 가이드라인:
      1. 결과를 읽기 쉽게 정리해서 제시
      2. 금액은 만원 단위이므로 억원/만원으로 변환하여 표시
      3. 구체적인 정보(기업명, 기관명, 금액 등)를 포함
      4. 추가 질문이나 도움이 필요한지 물어보기
      `;
    }

    const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: '당신은 AI매치허브의 전문 상담원입니다. 공급기업과 수요기관 정보를 제공하는 플랫폼에서 친근하고 전문적인 답변을 제공합니다.' 
          },
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const finalData = await finalResponse.json();
    const aiResponse = finalData.choices[0].message.content;

    // 채팅 기록 저장
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: aiResponse,
        context: {
          sql_query: sqlQuery,
          results_count: queryResults.length,
          has_error: !!queryError
        },
      });

    if (saveError) {
      console.error('Error saving chat message:', saveError);
    }

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        context: {
          sql_query: sqlQuery,
          results_count: queryResults.length
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
