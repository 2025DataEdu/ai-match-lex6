
export interface KeywordAnalysis {
  primaryKeywords: string[];
  serviceType: string | null;
  intent: 'search' | 'information' | 'comparison';
  context: {
    budget?: string;
    timeline?: string;
    region?: string;
    requirements?: string[];
  };
}

export async function analyzeNaturalLanguage(message: string, openAIApiKey: string): Promise<KeywordAnalysis> {
  const analysisPrompt = `다음 자연어 질의를 분석하여 JSON 형태로 응답해주세요:

질의: "${message}"

다음 JSON 형식으로 응답하세요:
{
  "primaryKeywords": ["키워드1", "키워드2", "키워드3"],
  "serviceType": "AI 서비스 유형 (챗봇/대화형AI, 컴퓨터비전/이미지AI, 음성인식/음성AI, 자연어처리/텍스트AI, 예측분석/데이터AI, 추천시스템/개인화AI, 로봇/자동화AI 중 하나 또는 null)",
  "intent": "search",
  "context": {
    "budget": "예산 정보가 있다면",
    "timeline": "일정 정보가 있다면", 
    "region": "지역 정보가 있다면",
    "requirements": ["추가 요구사항들"]
  }
}

규칙:
1. primaryKeywords는 3-5개의 핵심 검색 키워드
2. serviceType은 AI 서비스 유형 중 가장 적합한 것
3. intent는 항상 "search"
4. context는 질의에서 언급된 추가 정보들
5. 오직 JSON만 응답하세요`;

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
        max_tokens: 300,
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
    
    return {
      primaryKeywords: analysis.primaryKeywords || [],
      serviceType: analysis.serviceType || null,
      intent: analysis.intent || 'search',
      context: analysis.context || {}
    };
  } catch (error) {
    console.error('자연어 분석 오류:', error);
    
    // 간단한 키워드 추출 폴백
    const words = message.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 1 && 
      !['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는'].includes(word)
    );
    
    return {
      primaryKeywords: keywords.slice(0, 3),
      serviceType: null,
      intent: 'search',
      context: {}
    };
  }
}
