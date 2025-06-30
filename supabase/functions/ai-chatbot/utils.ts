
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function saveChatMessage(supabase: any, userId: string, message: string, aiResponse: string, analysis: any, resultsCount: number) {
  try {
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: aiResponse,
        context: {
          analysis: analysis,
          results_count: resultsCount,
          intent: analysis.intent,
          queryType: analysis.queryType,
          cached: false
        },
      });

    if (saveError) {
      console.error('Error saving chat message:', saveError);
    }
  } catch (saveError) {
    console.error('Chat save error:', saveError);
  }
}

export function createErrorResponse(query: string) {
  return {
    error: 'Processing error',
    response: `죄송합니다. '${query}' 처리 중 일시적인 오류가 발생했습니다. 자연어로 다시 질문해주세요.\n\n예시:\n• "AI 챗봇 개발 전문업체 찾아줘"\n• "공급기업이 총 몇 곳이야?"\n• "CCTV 영상분석할 수 있는 기업 알려줘"`
  };
}
