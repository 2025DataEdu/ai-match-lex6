
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

    // 공급기업 데이터 처리
    const { data: suppliers, error: suppliersError } = await supabase
      .from('공급기업')
      .select('*');

    if (suppliersError) {
      console.error('Error fetching suppliers:', suppliersError);
      throw suppliersError;
    }

    console.log(`Processing ${suppliers?.length || 0} suppliers...`);

    if (suppliers) {
      for (const supplier of suppliers) {
        const content = `기업명: ${supplier.기업명 || ''}
업종: ${supplier.업종 || ''}
유형: ${supplier.유형 || ''}
세부설명: ${supplier.세부설명 || ''}
보유특허: ${supplier.보유특허 || ''}
기업홈페이지: ${supplier.기업홈페이지 || ''}`;

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
          console.log(`Processed supplier: ${supplier.기업명}`);
        }
      }
    }

    // 수요기관 데이터 처리
    const { data: demands, error: demandsError } = await supabase
      .from('수요기관')
      .select('*');

    if (demandsError) {
      console.error('Error fetching demands:', demandsError);
      throw demandsError;
    }

    console.log(`Processing ${demands?.length || 0} demands...`);

    if (demands) {
      for (const demand of demands) {
        const content = `수요기관: ${demand.수요기관 || ''}
부서명: ${demand.부서명 || ''}
수요내용: ${demand.수요내용 || ''}
유형: ${demand.유형 || ''}
금액: ${demand.금액 || ''}
기타요구사항: ${demand.기타요구사항 || ''}`;

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
          console.log(`Processed demand: ${demand.수요기관}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Embeddings created successfully',
        suppliersProcessed: suppliers?.length || 0,
        demandsProcessed: demands?.length || 0
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
