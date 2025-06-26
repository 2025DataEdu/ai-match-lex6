
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

    // 벡터 검색을 통해 관련 컨텍스트 찾기
    const vectorSearchResponse = await fetch(`${supabaseUrl}/functions/v1/vector-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        matchCount: 3
      }),
    });

    const vectorSearchData = await vectorSearchResponse.json();
    const contextResults = vectorSearchData.results || [];

    // 컨텍스트 정보 구성
    let contextText = '';
    if (contextResults.length > 0) {
      contextText = '\n\n관련 정보:\n';
      contextResults.forEach((result: any, index: number) => {
        contextText += `${index + 1}. ${result.content}\n`;
      });
    }

    // ChatGPT에게 질문
    const systemPrompt = `당신은 AI매치허브의 전문 상담원입니다. 
공급기업과 수요기관을 연결하는 플랫폼에서 사용자의 질문에 답변해주세요.
제공된 관련 정보를 바탕으로 정확하고 도움이 되는 답변을 제공하세요.
답변은 친근하고 전문적인 톤으로 작성해주세요.`;

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
        context: contextResults,
      });

    if (saveError) {
      console.error('Error saving chat message:', saveError);
    }

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        context: contextResults
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
