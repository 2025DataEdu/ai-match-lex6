
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Starting embedding creation process...');

    // 기존 임베딩 데이터 삭제
    const { error: deleteError } = await supabase
      .from('embeddings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error deleting existing embeddings:', deleteError);
    }

    let suppliersProcessed = 0;
    let demandsProcessed = 0;

    // 공급기업 데이터 처리
    const { data: suppliers, error: suppliersError } = await supabase
      .from('공급기업')
      .select('*');

    if (suppliersError) {
      console.error('Error fetching suppliers:', suppliersError);
    } else if (suppliers && suppliers.length > 0) {
      console.log(`Processing ${suppliers.length} suppliers...`);

      for (const supplier of suppliers) {
        try {
          const content = `기업명: ${supplier.기업명 || '정보없음'}
업종: ${supplier.업종 || '정보없음'}
유형: ${supplier.유형 || '정보없음'}
세부설명: ${supplier.세부설명 || '정보없음'}
보유특허: ${supplier.보유특허 || '정보없음'}
기업홈페이지: ${supplier.기업홈페이지 || '정보없음'}`;

          // 임베딩 생성
          const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'text-embedding-ada-002',
              input: content,
            }),
          });

          if (!embeddingResponse.ok) {
            throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          // 임베딩 저장
          const { error: insertError } = await supabase
            .from('embeddings')
            .insert({
              content,
              embedding,
              metadata: supplier,
              table_name: '공급기업',
              record_id: supplier.공급기업일련번호,
            });

          if (insertError) {
            console.error('Error inserting supplier embedding:', insertError);
          } else {
            suppliersProcessed++;
            console.log(`Processed supplier: ${supplier.기업명}`);
          }

          // API 호출 제한을 위한 대기
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error processing supplier ${supplier.기업명}:`, error);
        }
      }
    }

    // 수요기관 데이터 처리
    const { data: demands, error: demandsError } = await supabase
      .from('수요기관')
      .select('*');

    if (demandsError) {
      console.error('Error fetching demands:', demandsError);
    } else if (demands && demands.length > 0) {
      console.log(`Processing ${demands.length} demands...`);

      for (const demand of demands) {
        try {
          const content = `수요기관: ${demand.수요기관 || '정보없음'}
부서명: ${demand.부서명 || '정보없음'}
수요내용: ${demand.수요내용 || '정보없음'}
유형: ${demand.유형 || '정보없음'}
금액: ${demand.금액 ? demand.금액.toLocaleString() + '원' : '정보없음'}
기타요구사항: ${demand.기타요구사항 || '정보없음'}
시작일: ${demand.시작일 || '정보없음'}
종료일: ${demand.종료일 || '정보없음'}`;

          // 임베딩 생성
          const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'text-embedding-ada-002',
              input: content,
            }),
          });

          if (!embeddingResponse.ok) {
            throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          // 임베딩 저장
          const { error: insertError } = await supabase
            .from('embeddings')
            .insert({
              content,
              embedding,
              metadata: demand,
              table_name: '수요기관',
              record_id: demand.수요기관일련번호,
            });

          if (insertError) {
            console.error('Error inserting demand embedding:', insertError);
          } else {
            demandsProcessed++;
            console.log(`Processed demand: ${demand.수요기관}`);
          }

          // API 호출 제한을 위한 대기
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error processing demand ${demand.수요기관}:`, error);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Embeddings created successfully',
        suppliersProcessed,
        demandsProcessed,
        totalProcessed: suppliersProcessed + demandsProcessed
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-embeddings function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
