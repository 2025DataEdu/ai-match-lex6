
export interface KeywordAnalysis {
  primaryKeywords: string[];
  serviceType: string | null;
  intent: 'statistics' | 'supplier_search' | 'demand_search' | 'matching_info' | 'general_info';
  queryType: 'count' | 'search' | 'info';
  context: {
    budget?: string;
    timeline?: string;
    region?: string;
    requirements?: string[];
    entity?: 'supplier' | 'demand' | 'both';
  };
}

export async function analyzeNaturalLanguage(message: string, openAIApiKey: string): Promise<KeywordAnalysis> {
  const analysisPrompt = `다음 자연어 질의를 분석하여 JSON 형태로 응답해주세요:

질의: "${message}"

다음 JSON 형식으로 응답하세요:
{
  "primaryKeywords": ["키워드1", "키워드2", "키워드3"],
  "serviceType": "AI 서비스 유형 (챗봇/대화형AI, 컴퓨터비전/이미지AI, 음성인식/음성AI, 자연어처리/텍스트AI, 예측분석/데이터AI, 추천시스템/개인화AI, 로봇/자동화AI 중 하나 또는 null)",
  "intent": "statistics|supplier_search|demand_search|matching_info|general_info",
  "queryType": "count|search|info",
  "context": {
    "budget": "예산 정보가 있다면",
    "timeline": "일정 정보가 있다면", 
    "region": "지역 정보가 있다면",
    "requirements": ["추가 요구사항들"],
    "entity": "supplier|demand|both"
  }
}

의도(intent) 분류 규칙 - 하나만 선택:
- statistics: "몇 개", "수", "개수", "통계", "현황", "총 몇", "얼마나" 등이 포함된 질문
- supplier_search: 공급기업, 업체, 회사, 기술보유기업을 찾는 질문
- demand_search: 수요기관, 발주처, 도입예정기관을 찾는 질문  
- matching_info: 매칭, 연결, 추천 관련 질문
- general_info: 위에 해당하지 않는 일반적인 질문

쿼리 유형(queryType):
- count: 개수를 묻는 질문
- search: 특정 조건의 데이터를 찾는 질문
- info: 일반 정보를 묻는 질문

중요: intent는 반드시 하나만 선택하세요. 복합적인 질문도 가장 주된 의도 하나만 선택해주세요.

오직 JSON만 응답하세요`;

  try {
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
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // JSON 정제
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const analysis = JSON.parse(content);
    
    // intent 검증 및 정리
    let cleanIntent = analysis.intent;
    if (typeof cleanIntent === 'string' && cleanIntent.includes('|')) {
      // 복합 의도인 경우 첫 번째 것을 선택
      cleanIntent = cleanIntent.split('|')[0];
    }
    
    return {
      primaryKeywords: analysis.primaryKeywords || [],
      serviceType: analysis.serviceType || null,
      intent: cleanIntent || 'supplier_search',
      queryType: analysis.queryType || 'search',
      context: analysis.context || {}
    };
  } catch (error) {
    console.error('자연어 분석 오류:', error);
    
    // 간단한 키워드 추출 폴백
    const words = message.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 1 && 
      !['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는', '있어', '있는', '해줘', '알려줘'].includes(word)
    );
    
    // 의도 추측
    let intent = 'supplier_search';
    let queryType = 'search';
    let entity = 'supplier';
    
    if (message.includes('몇') || message.includes('수') || message.includes('개수') || message.includes('통계') || message.includes('총')) {
      intent = 'statistics';
      queryType = 'count';
    } else if (message.includes('수요') || message.includes('발주') || message.includes('도입')) {
      intent = 'demand_search';
      entity = 'demand';
    }
    
    return {
      primaryKeywords: keywords.slice(0, 3),
      serviceType: null,
      intent: intent as any,
      queryType: queryType as any,
      context: { entity: entity as any }
    };
  }
}
