
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { text, type, recordId } = await req.json();

    console.log('키워드 추출 요청:', { type, recordId, textLength: text?.length });

    if (!text || !type || !recordId) {
      throw new Error('필수 파라미터가 누락되었습니다.');
    }

    // ChatGPT API를 이용해 키워드 추출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `당신은 AI 매칭 시스템을 위한 키워드 추출 전문가입니다. 
주어진 텍스트에서 핵심 키워드를 추출하여 쉼표로 구분된 문자열로 반환하세요.
- 기술 용어, 서비스 유형, 업종, 핵심 기능을 중심으로 추출
- 5-15개의 핵심 키워드만 선별
- 한국어와 영어 키워드 모두 포함
- 너무 일반적인 단어는 제외
- 형태소 분석을 통해 의미있는 명사 중심으로 추출
예시: "인공지능, AI, 챗봇, 자연어처리, 머신러닝, 딥러닝, 음성인식"`
          },
          {
            role: 'user',
            content: `다음 텍스트에서 핵심 키워드를 추출해주세요:\n\n${text}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const aiResult = await response.json();
    
    if (!aiResult.choices || aiResult.choices.length === 0) {
      throw new Error('OpenAI API 응답이 올바르지 않습니다.');
    }

    const extractedKeywords = aiResult.choices[0].message.content.trim();
    
    console.log('추출된 키워드:', extractedKeywords);

    // 데이터베이스에 키워드 저장
    const tableName = type === 'supplier' ? '공급기업' : '수요기관';
    const idColumn = type === 'supplier' ? '공급기업일련번호' : '수요기관일련번호';
    
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        '추출키워드': extractedKeywords,
        '키워드추출상태': 'completed'
      })
      .eq(idColumn, recordId);

    if (updateError) {
      console.error('키워드 저장 오류:', updateError);
      throw new Error(`키워드 저장 실패: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      keywords: extractedKeywords,
      recordId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('키워드 추출 오류:', error);
    return new Response(JSON.stringify({ 
      error: error.message || '키워드 추출에 실패했습니다.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
