
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

import { checkCache, saveToCache } from './cache.ts';
import { generateQuickSQL } from './sqlTemplates.ts';
import { generateSQLWithAI } from './aiSqlGenerator.ts';
import { formatResponse, formatCachedResponse } from './responseFormatter.ts';

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Processing chatbot message:', message);

    // 1단계: 캐시 확인
    const cacheResult = await checkCache(supabase, message);
    if (cacheResult.found) {
      console.log('Cache hit! Returning cached result');
      
      const aiResponse = formatCachedResponse(message, cacheResult.data);
      
      return new Response(
        JSON.stringify({ 
          response: aiResponse,
          context: {
            cached: true,
            results_count: cacheResult.data?.length || 0
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
      // 3단계: GPT를 통한 SQL 생성
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not found');
      }

      generatedSQL = await generateSQLWithAI(message, openAIApiKey);
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
    const aiResponse = formatResponse(message, queryResults, queryError);

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
