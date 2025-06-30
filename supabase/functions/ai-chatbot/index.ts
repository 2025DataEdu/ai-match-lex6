
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

import { checkCache, saveToCache } from './cache.ts';
import { analyzeNaturalLanguage } from './naturalLanguageProcessor.ts';
import { formatIntelligentResponse } from './intelligentResponseFormatter.ts';
import { 
  executeEnhancedStatisticsQuery,
  executeEnhancedSupplierSearch,
  executeEnhancedDemandSearch
} from './queryExecutors.ts';
import { corsHeaders, saveChatMessage, createErrorResponse } from './utils.ts';

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Processing natural language query:', message);

    // 1단계: 캐시 확인 (더 엄격한 조건)
    const cacheResult = await checkCache(supabase, message);
    if (cacheResult.found) {
      const cachedResponse = formatIntelligentResponse(
        message, 
        { primaryKeywords: [], serviceType: null, intent: 'supplier_search', queryType: 'search', context: {} }, 
        cacheResult.data
      ) + '\n\n⚡ (캐시된 결과)';
      
      return new Response(
        JSON.stringify({ 
          response: cachedResponse,
          context: {
            cached: true,
            results_count: cacheResult.data?.length || 0
          }
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2단계: ChatGPT를 활용한 자연어 분석
    console.log('Analyzing with ChatGPT...');
    const analysis = await analyzeNaturalLanguage(message, openAIApiKey);
    console.log('ChatGPT Analysis result:', JSON.stringify(analysis, null, 2));

    // 3단계: 의도별 정확한 쿼리 실행
    let queryResults = [];
    let queryError = null;

    try {
      switch (analysis.intent) {
        case 'statistics':
          queryResults = await executeEnhancedStatisticsQuery(supabase, analysis);
          break;
        case 'supplier_search':
          queryResults = await executeEnhancedSupplierSearch(supabase, analysis);
          break;
        case 'demand_search':
          queryResults = await executeEnhancedDemandSearch(supabase, analysis);
          break;
        default:
          queryResults = await executeEnhancedSupplierSearch(supabase, analysis);
      }

      console.log(`Query completed: ${queryResults.length} results found`);
      
      // 결과를 캐시에 저장 (개선된 로직)
      if (queryResults.length > 0) {
        await saveToCache(supabase, message, analysis.intent, queryResults);
      }
      
    } catch (error) {
      console.error('Query execution error:', error);
      queryError = error;
    }

    // 4단계: 지능형 응답 생성
    const aiResponse = formatIntelligentResponse(message, analysis, queryResults, queryError);

    // 채팅 기록 저장
    await saveChatMessage(supabase, userId, message, aiResponse, analysis, queryResults.length);

    console.log('Intelligent AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        context: {
          analysis: analysis,
          results_count: queryResults.length,
          intent: analysis.intent,
          queryType: analysis.queryType,
          cached: false
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    const errorResponse = createErrorResponse(req.url);
    return new Response(
      JSON.stringify(errorResponse), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
