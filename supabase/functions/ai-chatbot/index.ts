
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

    // 향상된 데이터베이스 검색 (비용 관련 특별 처리)
    const searchResults = await searchDirectDatabase(supabase, message);
    
    console.log(`Direct search results: ${searchResults.length}`);

    // 컨텍스트 정보 구성
    let contextText = '';
    
    if (searchResults.length > 0) {
      contextText = '\n\n관련 정보:\n';
      
      searchResults.forEach((result, index) => {
        if (result.table_name === '공급기업') {
          contextText += `${index + 1}. [공급기업] 기업명: ${result.기업명 || '정보없음'}, 업종: ${result.업종 || '정보없음'}, 유형: ${result.유형 || '정보없음'}, 세부설명: ${result.세부설명 || '정보없음'}\n`;
        } else if (result.table_name === '수요기관') {
          const budgetText = result.금액 ? `${result.금액.toLocaleString()}만원` : '정보없음';
          const isHighBudget = result.금액 && result.금액 >= 10000;
          contextText += `${index + 1}. [수요기관] 기관명: ${result.수요기관 || '정보없음'}, 부서: ${result.부서명 || '정보없음'}, 수요내용: ${result.수요내용 || '정보없음'}, 예산: ${budgetText}${isHighBudget ? ' (고액수요)' : ''}, 유형: ${result.유형 || '정보없음'}\n`;
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

비용/예산 관련 특별 지침:
- 수요기관의 예산은 "만원" 단위로 저장되어 있습니다
- 1억원 = 10,000만원으로 계산해주세요
- 비용 관련 질문시 예산 범위를 명확히 제시해주세요
- 고액 수요(1억원 이상)는 특별히 강조해서 안내해주세요

제공된 관련 정보를 바탕으로 정확하고 도움이 되는 답변을 제공하세요.
답변은 친근하고 전문적인 톤으로 작성해주세요.
구체적인 데이터가 있을 때는 정확한 정보를 제공하고, 없을 때는 일반적인 안내를 해주세요.

한국어로 답변해주세요.`;

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
        context: searchResults,
      });

    if (saveError) {
      console.error('Error saving chat message:', saveError);
    }

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        context: searchResults
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

// 향상된 직접 데이터베이스 검색 함수
async function searchDirectDatabase(supabase: any, query: string) {
  const results: any[] = [];
  
  try {
    // 검색어를 공백으로 분리하여 각 키워드로 검색
    const keywords = query.split(' ').filter(keyword => keyword.length > 0);
    console.log('Searching with keywords:', keywords);

    // 비용/금액 관련 키워드 감지
    const budgetKeywords = ['비용', '금액', '예산', '만원', '억', '천만', '고액', '1억'];
    const isBudgetQuery = budgetKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );

    // 숫자 추출 (비용 관련 검색용)
    const numbers = query.match(/\d+/g);
    const budgetThreshold = numbers ? parseInt(numbers[0]) : null;

    console.log('Budget query detected:', isBudgetQuery, 'Threshold:', budgetThreshold);

    // 공급기업 검색 - 더 넓은 범위로 검색
    if (!isBudgetQuery || keywords.some(k => ['기업', '공급', '업체', '회사'].includes(k))) {
      const { data: suppliers, error: suppliersError } = await supabase
        .from('공급기업')
        .select('*')
        .or(keywords.map(keyword => 
          `기업명.ilike.%${keyword}%, 업종.ilike.%${keyword}%, 유형.ilike.%${keyword}%, 세부설명.ilike.%${keyword}%`
        ).join(','))
        .limit(10);
      
      if (suppliersError) {
        console.error('Suppliers search error:', suppliersError);
      } else if (suppliers && suppliers.length > 0) {
        console.log(`Found ${suppliers.length} suppliers`);
        suppliers.forEach((supplier: any) => {
          results.push({
            ...supplier,
            table_name: '공급기업'
          });
        });
      }
    }

    // 수요기관 검색 - 비용 관련 특별 처리
    let demandsQuery = supabase.from('수요기관').select('*');

    if (isBudgetQuery && budgetThreshold) {
      // 비용 관련 검색일 때 특별 처리
      if (query.includes('이상') || query.includes('넘는') || query.includes('초과')) {
        demandsQuery = demandsQuery.gte('금액', budgetThreshold);
        console.log(`Searching for demands >= ${budgetThreshold}`);
      } else if (query.includes('이하') || query.includes('미만')) {
        demandsQuery = demandsQuery.lte('금액', budgetThreshold);
        console.log(`Searching for demands <= ${budgetThreshold}`);
      }
      
      // 1억 관련 특별 처리
      if (query.includes('1억') || query.includes('일억')) {
        demandsQuery = demandsQuery.gte('금액', 10000); // 1억원 = 10,000만원
        console.log('Searching for demands >= 1억원 (10,000만원)');
      }
    } else {
      // 일반 키워드 검색
      demandsQuery = demandsQuery.or(keywords.map(keyword => 
        `수요기관.ilike.%${keyword}%, 부서명.ilike.%${keyword}%, 수요내용.ilike.%${keyword}%, 유형.ilike.%${keyword}%`
      ).join(','));
    }

    const { data: demands, error: demandsError } = await demandsQuery.limit(10);
    
    if (demandsError) {
      console.error('Demands search error:', demandsError);
    } else if (demands && demands.length > 0) {
      console.log(`Found ${demands.length} demands`);
      demands.forEach((demand: any) => {
        results.push({
          ...demand,
          table_name: '수요기관'
        });
      });
    }

    // 결과가 없으면 더 넓은 검색 시도
    if (results.length === 0 && !isBudgetQuery) {
      console.log('No results found, trying broader search...');
      
      // 전체 데이터 샘플 가져오기
      const { data: sampleSuppliers } = await supabase
        .from('공급기업')
        .select('*')
        .limit(5);
        
      const { data: sampleDemands } = await supabase
        .from('수요기관')
        .select('*')
        .limit(5);
      
      if (sampleSuppliers) {
        sampleSuppliers.forEach((supplier: any) => {
          results.push({
            ...supplier,
            table_name: '공급기업'
          });
        });
      }
      
      if (sampleDemands) {
        sampleDemands.forEach((demand: any) => {
          results.push({
            ...demand,
            table_name: '수요기관'
          });
        });
      }
    }

  } catch (error) {
    console.error('Direct database search error:', error);
  }
  
  console.log(`Total search results: ${results.length}`);
  return results;
}
