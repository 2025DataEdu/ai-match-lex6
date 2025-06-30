
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 간단한 해시 함수
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash).toString(16);
}

// 캐시 확인 및 저장 함수
async function checkCache(supabase: any, query: string) {
  const queryHash = simpleHash(query.toLowerCase().trim());
  
  // 캐시 확인
  const { data: cached, error } = await supabase
    .from('query_cache')
    .select('*')
    .eq('query_hash', queryHash)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!error && cached) {
    // 캐시 히트 수 증가
    await supabase
      .from('query_cache')
      .update({ hit_count: cached.hit_count + 1 })
      .eq('id', cached.id);
    
    return {
      found: true,
      sql: cached.generated_sql,
      data: cached.result_data
    };
  }

  return { found: false };
}

async function saveToCache(supabase: any, query: string, sql: string, results: any[]) {
  const queryHash = simpleHash(query.toLowerCase().trim());
  
  await supabase
    .from('query_cache')
    .upsert({
      query_hash: queryHash,
      original_query: query,
      generated_sql: sql,
      result_data: results,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1시간 후 만료
    });
}

// 템플릿 기반 빠른 SQL 생성
function generateQuickSQL(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
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
    return `SELECT * FROM 공급기업 WHERE 보유특허 IS NOT NULL AND 보유특허 != '' LIMIT 20`;
  }
  
  // AI 관련 쿼리 템플릿
  if (lowerMessage.includes('ai') || lowerMessage.includes('인공지능')) {
    return `SELECT * FROM 공급기업 WHERE 세부설명 ILIKE '%AI%' OR 업종 ILIKE '%AI%' OR 세부설명 ILIKE '%인공지능%' OR 업종 ILIKE '%인공지능%' LIMIT 20`;
  }
  
  // 일반적인 키워드 검색 템플릿
  const keywords = lowerMessage.split(' ').filter(word => word.length > 1);
  if (keywords.length > 0) {
    const conditions = keywords.map(keyword => 
      `(기업명 ILIKE '%${keyword}%' OR 업종 ILIKE '%${keyword}%' OR 세부설명 ILIKE '%${keyword}%')`
    ).join(' OR ');
    return `SELECT * FROM 공급기업 WHERE ${conditions} LIMIT 20`;
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Processing chatbot message:', message);

    // 1단계: 캐시 확인
    const cacheResult = await checkCache(supabase, message);
    if (cacheResult.found) {
      console.log('Cache hit! Returning cached result');
      
      // 캐시된 결과로 응답 생성
      const cachedData = cacheResult.data;
      let aiResponse = '';
      
      if (cachedData && cachedData.length > 0) {
        aiResponse = `질문하신 "${message}"에 대한 검색 결과입니다.\n\n총 ${cachedData.length}개의 결과를 찾았습니다.\n\n`;
        
        cachedData.slice(0, 5).forEach((item: any, index: number) => {
          if (item.기업명) {
            aiResponse += `${index + 1}. **${item.기업명}**\n`;
            if (item.업종) aiResponse += `   - 업종: ${item.업종}\n`;
            if (item.세부설명) aiResponse += `   - 설명: ${item.세부설명.substring(0, 100)}...\n`;
          } else if (item.수요기관) {
            aiResponse += `${index + 1}. **${item.수요기관}**\n`;
            if (item.수요내용) aiResponse += `   - 수요내용: ${item.수요내용.substring(0, 100)}...\n`;
            if (item.금액) aiResponse += `   - 금액: ${(item.금액 / 10000).toFixed(0)}억원\n`;
          }
          aiResponse += '\n';
        });
      } else {
        aiResponse = `"${message}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보시겠어요?`;
      }
      
      return new Response(
        JSON.stringify({ 
          response: aiResponse,
          context: {
            cached: true,
            results_count: cachedData?.length || 0
          }
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2단계: 템플릿 기반 빠른 SQL 생성 시도
    let generatedSQL = generateQuickSQL(message);
    let isTemplateGenerated = false;

    if (generatedSQL) {
      console.log('Template-based SQL generated:', generatedSQL);
      isTemplateGenerated = true;
    } else {
      // 3단계: GPT를 통한 SQL 생성 (기존 방식)
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not found');
      }

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
      generatedSQL = sqlData.choices[0].message.content.trim();
    }
    
    console.log('Final SQL:', generatedSQL);

    // 4단계: SQL 실행
    let queryResults = [];
    let queryError = null;

    try {
      const { data, error } = await supabase.rpc('execute_dynamic_query', {
        query_text: generatedSQL
      });

      if (error) {
        console.error('SQL execution error:', error);
        queryError = error;
      } else {
        queryResults = data || [];
        console.log(`SQL execution successful: ${queryResults.length} results`);
        
        // 결과를 캐시에 저장
        if (queryResults.length > 0) {
          await saveToCache(supabase, message, generatedSQL, queryResults);
        }
      }
    } catch (error) {
      console.error('SQL execution error:', error);
      queryError = error;
    }

    // 5단계: 결과 처리 및 응답 생성
    let aiResponse = '';
    
    if (queryError) {
      aiResponse = `죄송합니다. 검색 중 오류가 발생했습니다. 다른 방법으로 질문해주세요.`;
    } else if (queryResults.length === 0) {
      aiResponse = `"${message}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보시겠어요?`;
    } else {
      // 간단하고 빠른 결과 정리
      aiResponse = `질문하신 "${message}"에 대한 검색 결과입니다.\n\n총 ${queryResults.length}개의 결과를 찾았습니다.\n\n`;
      
      queryResults.slice(0, 5).forEach((item: any, index: number) => {
        if (item.기업명) {
          aiResponse += `${index + 1}. **${item.기업명}**\n`;
          if (item.업종) aiResponse += `   - 업종: ${item.업종}\n`;
          if (item.세부설명) aiResponse += `   - 설명: ${item.세부설명.substring(0, 100)}...\n`;
        } else if (item.수요기관) {
          aiResponse += `${index + 1}. **${item.수요기관}**\n`;
          if (item.수요내용) aiResponse += `   - 수요내용: ${item.수요내용.substring(0, 100)}...\n`;
          if (item.금액) aiResponse += `   - 금액: ${(item.금액 / 10000).toFixed(0)}억원\n`;
        }
        aiResponse += '\n';
      });
      
      if (queryResults.length > 5) {
        aiResponse += `... 외 ${queryResults.length - 5}개의 추가 결과가 있습니다.\n\n`;
      }
    }

    aiResponse += `\n추가로 궁금한 것이 있으시면 언제든 질문해주세요!`;

    // 채팅 기록 저장
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: aiResponse,
        context: {
          sql_query: generatedSQL,
          results_count: queryResults.length,
          template_generated: isTemplateGenerated,
          cached: false
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
          sql_query: generatedSQL,
          results_count: queryResults.length,
          template_generated: isTemplateGenerated,
          cached: false
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
