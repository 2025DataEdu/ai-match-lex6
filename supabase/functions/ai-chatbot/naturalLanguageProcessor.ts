
export interface KeywordAnalysis {
  primaryKeywords: string[];
  serviceType: string | null;
  intent: 'statistics' | 'supplier_search' | 'demand_search' | 'general_info';
  queryType: 'count' | 'search' | 'info';
  context: {
    entity?: 'supplier' | 'demand' | 'both';
  };
}

export async function analyzeNaturalLanguage(message: string, openAIApiKey: string): Promise<KeywordAnalysis> {
  try {
    const analysisPrompt = `다음 사용자 질문을 분석해서 JSON 형태로 응답해주세요:

사용자 질문: "${message}"

분석 기준:
1. primaryKeywords: 핵심 검색 키워드 3개 이하 (예: ["AI", "챗봇", "개발"])
2. serviceType: AI 서비스 유형 (예: "챗봇/대화형AI", "컴퓨터비전/이미지AI", "음성인식/음성AI", "로봇/자동화AI" 등)
3. intent: 의도 분류
   - "statistics": 개수, 통계 질문 (예: "몇 개", "총 얼마나")
   - "supplier_search": 공급기업 검색 (기본값)
   - "demand_search": 수요기관 검색 (예: "수요기관", "도입 예정")
   - "general_info": 일반 정보 질문
4. queryType: "count" (통계), "search" (검색), "info" (정보)
5. context.entity: "supplier" 또는 "demand"

JSON 응답만 해주세요:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.1,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0].message.content.trim());
    
    console.log('ChatGPT Analysis Result:', JSON.stringify(analysisResult, null, 2));
    
    return {
      primaryKeywords: analysisResult.primaryKeywords || [],
      serviceType: analysisResult.serviceType || null,
      intent: analysisResult.intent || 'supplier_search',
      queryType: analysisResult.queryType || 'search',
      context: {
        entity: analysisResult.context?.entity || 'supplier'
      }
    };
  } catch (error) {
    console.error('ChatGPT analysis error:', error);
    
    // 실패 시 간단한 백업 분석
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 1 && 
      !['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는', '있어', '있는', '해줘', '알려줘', '찾아줘', '추천'].includes(word)
    ).slice(0, 3);
    
    let intent = 'supplier_search';
    if (lowerMessage.includes('몇') || lowerMessage.includes('수') || lowerMessage.includes('개수')) {
      intent = 'statistics';
    } else if (lowerMessage.includes('수요')) {
      intent = 'demand_search';
    }
    
    return {
      primaryKeywords: keywords,
      serviceType: null,
      intent: intent as any,
      queryType: intent === 'statistics' ? 'count' : 'search',
      context: {
        entity: intent === 'demand_search' ? 'demand' : 'supplier'
      }
    };
  }
}
