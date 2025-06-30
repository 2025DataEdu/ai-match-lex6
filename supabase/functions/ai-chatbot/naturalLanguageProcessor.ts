
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
    specificField?: string;
  };
}

export async function analyzeNaturalLanguage(message: string, openAIApiKey: string): Promise<KeywordAnalysis> {
  const analysisPrompt = `다음 자연어 질의를 분석하여 JSON 형태로 응답해주세요:

질의: "${message}"

다음 JSON 형식으로 응답하세요:
{
  "primaryKeywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "serviceType": "AI 서비스 유형 (챗봇/대화형AI, 컴퓨터비전/이미지AI, 음성인식/음성AI, 자연어처리/텍스트AI, 예측분석/데이터AI, 추천시스템/개인화AI, 로봇/자동화AI 중 하나 또는 null)",
  "intent": "statistics|supplier_search|demand_search|matching_info|general_info",
  "queryType": "count|search|info",
  "context": {
    "budget": "예산 정보가 있다면",
    "timeline": "일정 정보가 있다면", 
    "region": "지역 정보가 있다면",
    "requirements": ["추가 요구사항들"],
    "entity": "supplier|demand|both",
    "specificField": "특정 검색 필드가 명시된 경우 (유형, 특허, 키워드 등)"
  }
}

분석 규칙:
1. 의도(intent) 분류 - 하나만 선택:
   - statistics: "몇 개", "수", "개수", "통계", "현황", "총 몇", "얼마나" 등 - 단순히 숫자만 묻는 경우
   - supplier_search: 공급기업, 업체, 회사, 기술보유기업, 개발업체 등을 찾는 질문
   - demand_search: "수요"가 포함되고 구체적인 기관/업체를 찾는 질문 (예: "AI 챗봇 개발 수요", "챗봇 도입 수요", "개발 수요기관")
   - matching_info: 매칭, 연결, 추천 관련 질문
   - general_info: 위에 해당하지 않는 일반적인 질문

2. 키워드 추출:
   - 기술 관련 키워드 우선 (AI, 챗봇, CCTV, 음성인식 등)
   - 업종/유형 키워드 (개발, 분석, 인식, 처리 등)
   - 부가 키워드 (솔루션, 시스템, 플랫폼 등)

3. 서비스 타입 매핑:
   - 챗봇, 대화형, 상담 → "챗봇/대화형AI"
   - CCTV, 영상, 이미지, 비전 → "컴퓨터비전/이미지AI"
   - 음성, STT, TTS, 음성인식 → "음성인식/음성AI"
   - 자연어, 텍스트, 언어처리 → "자연어처리/텍스트AI"
   - 예측, 분석, 데이터 → "예측분석/데이터AI"
   - 추천, 개인화 → "추천시스템/개인화AI"
   - 로봇, 자동화, RPA → "로봇/자동화AI"

4. 맥락 정보:
   - entity: supplier (공급기업 대상), demand (수요기관 대상), both (둘 다)
   - specificField: 특정 필드 언급시 해당 필드명

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
        max_tokens: 500,
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
      cleanIntent = cleanIntent.split('|')[0];
    }
    
    // 키워드 정제 - 불용어 제거 및 중요 키워드 추출
    const cleanKeywords = (analysis.primaryKeywords || [])
      .filter(keyword => keyword && keyword.length > 1)
      .filter(keyword => !['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는', '있어', '있는', '해줘', '알려줘', '찾아줘', '추천'].includes(keyword.toLowerCase()))
      .slice(0, 5); // 최대 5개 키워드로 제한
    
    return {
      primaryKeywords: cleanKeywords,
      serviceType: analysis.serviceType || null,
      intent: cleanIntent || 'supplier_search',
      queryType: analysis.queryType || 'search',
      context: {
        ...analysis.context,
        entity: analysis.context?.entity || 'supplier'
      }
    };
  } catch (error) {
    console.error('자연어 분석 오류:', error);
    
    // 간단한 키워드 추출 폴백
    const words = message.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 1 && 
      !['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는', '있어', '있는', '해줘', '알려줘', '찾아줘', '추천'].includes(word)
    );
    
    // 의도 추측 - 개선된 로직
    let intent = 'supplier_search';
    let queryType = 'search';
    let entity = 'supplier';
    
    // 통계 관련 키워드 체크 (단순 개수만 물어보는 경우)
    if ((message.includes('몇') || message.includes('수') || message.includes('개수') || message.includes('통계') || message.includes('총')) 
        && !message.includes('수요')) {
      intent = 'statistics';
      queryType = 'count';
    } 
    // 수요 관련 키워드가 있고 구체적인 기관을 찾는 경우
    else if (message.includes('수요') && (message.includes('기관') || message.includes('도입') || message.includes('원하는') || message.includes('필요한'))) {
      intent = 'demand_search';
      entity = 'demand';
    } 
    // 일반적인 수요 관련 질문도 수요기관 검색으로 분류
    else if (message.includes('수요')) {
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
