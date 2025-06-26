
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

    // 벡터 검색과 직접 데이터베이스 검색을 병렬로 수행
    const [vectorSearchResult, directSearchResult] = await Promise.all([
      // 벡터 검색
      fetch(`${supabaseUrl}/functions/v1/vector-search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          matchCount: 5
        }),
      }).then(res => res.json()).catch(err => {
        console.error('Vector search error:', err);
        return { results: [] };
      }),
      
      // 직접 데이터베이스 검색
      searchDirectDatabase(supabase, message)
    ]);

    // 검색 결과 통합
    const vectorResults = vectorSearchResult.results || [];
    const directResults = directSearchResult || [];
    
    console.log(`Vector search results: ${vectorResults.length}`);
    console.log(`Direct search results: ${directResults.length}`);

    // 컨텍스트 정보 구성
    let contextText = '';
    
    if (vectorResults.length > 0 || directResults.length > 0) {
      contextText = '\n\n관련 정보:\n';
      
      // 벡터 검색 결과 추가
      vectorResults.forEach((result: any, index: number) => {
        contextText += `${index + 1}. ${result.content}\n`;
      });
      
      // 직접 검색 결과 추가
      directResults.forEach((result: any, index: number) => {
        const startIndex = vectorResults.length + index + 1;
        if (result.table_name === '공급기업') {
          contextText += `${startIndex}. 공급기업 - 기업명: ${result.기업명}, 업종: ${result.업종}, 유형: ${result.유형}, 세부설명: ${result.세부설명}\n`;
        } else if (result.table_name === '수요기관') {
          contextText += `${startIndex}. 수요기관 - 기관명: ${result.수요기관}, 부서: ${result.부서명}, 수요내용: ${result.수요내용}, 금액: ${result.금액}원\n`;
        }
      });
    }

    // ChatGPT에게 질문
    const systemPrompt = `당신은 AI매치허브의 전문 상담원입니다. 
공급기업과 수요기관을 연결하는 플랫폼에서 사용자의 질문에 답변해주세요.

주요 역할:
1. 공급기업 정보 제공 (기업명, 업종, 유형, 세부설명, 보유특허 등)
2. 수요기관 정보 제공 (기관명, 부서명, 수요내용, 예산, 일정 등)
3. 적절한 매칭 추천
4. 사업 기회 안내

제공된 관련 정보를 바탕으로 정확하고 도움이 되는 답변을 제공하세요.
답변은 친근하고 전문적인 톤으로 작성해주세요.
구체적인 데이터가 있을 때는 정확한 정보를 제공하고, 없을 때는 일반적인 안내를 해주세요.`;

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message + contextText }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const chatData = await chatResponse.json();
    const aiResponse = chatData.choices[0].message.content;

    // 채팅 기록 저장
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: aiResponse,
        context: [...vectorResults, ...directResults],
      });

    if (saveError) {
      console.error('Error saving chat message:', saveError);
    }

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        context: [...vectorResults, ...directResults]
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

// 직접 데이터베이스 검색 함수
async function searchDirectDatabase(supabase: any, query: string) {
  const results: any[] = [];
  
  try {
    // 공급기업 검색
    const { data: suppliers } = await supabase
      .from('공급기업')
      .select('*')
      .or(`기업명.ilike.%${query}%,업종.ilike.%${query}%,유형.ilike.%${query}%,세부설명.ilike.%${query}%`)
      .limit(5);
    
    if (suppliers) {
      suppliers.forEach((supplier: any) => {
        results.push({
          ...supplier,
          table_name: '공급기업'
        });
      });
    }

    // 수요기관 검색
    const { data: demands } = await supabase
      .from('수요기관')
      .select('*')
      .or(`수요기관.ilike.%${query}%,부서명.ilike.%${query}%,수요내용.ilike.%${query}%,유형.ilike.%${query}%`)
      .limit(5);
    
    if (demands) {
      demands.forEach((demand: any) => {
        results.push({
          ...demand,
          table_name: '수요기관'
        });
      });
    }
  } catch (error) {
    console.error('Direct database search error:', error);
  }
  
  return results;
}
