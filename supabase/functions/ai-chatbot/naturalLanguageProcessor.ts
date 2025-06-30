
export interface KeywordAnalysis {
  primaryKeywords: string[];
  serviceType: string | null;
  intent: 'statistics' | 'supplier_search' | 'demand_search' | 'general_info';
  queryType: 'count' | 'search' | 'info';
  context: {
    entity?: 'supplier' | 'demand' | 'both';
  };
}

// 백업 분석 로직 강화
function performBackupAnalysis(message: string): KeywordAnalysis {
  const lowerMessage = message.toLowerCase();
  
  // 수요 관련 키워드 확인
  const demandKeywords = ['수요', '도입', '필요', '구매', '발주', '예정', '계획', '원해', '원함', '찾고'];
  const isDemandRelated = demandKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // 공급 관련 키워드 확인
  const supplierKeywords = ['공급', '업체', '기업', '회사', '개발사', '제공', '판매'];
  const isSupplierRelated = supplierKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // 통계 관련 키워드 확인
  const statisticsKeywords = ['몇', '총', '개수', '수량', '통계', '얼마나'];
  const isStatistics = statisticsKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // 키워드 추출 (불용어 제거)
  const stopWords = ['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는', '있어', '있는', '해줘', '알려줘', '찾아줘', '추천', '수요가', '있나', '있어?'];
  const words = lowerMessage.split(/\s+/);
  const keywords = words.filter(word => 
    word.length > 1 && 
    !stopWords.includes(word) &&
    !['?', '!', '.', ','].includes(word)
  ).slice(0, 3);
  
  // 의도 결정 로직 개선
  let intent: KeywordAnalysis['intent'] = 'supplier_search';
  let entity: 'supplier' | 'demand' = 'supplier';
  
  if (isStatistics && !isDemandRelated && !isSupplierRelated) {
    intent = 'statistics';
  } else if (isDemandRelated || lowerMessage.includes('수요기관')) {
    intent = 'demand_search';
    entity = 'demand';
  } else if (isSupplierRelated || lowerMessage.includes('공급기업')) {
    intent = 'supplier_search';
    entity = 'supplier';
  } else {
    // 문맥으로 판단
    if (lowerMessage.includes('필요') || lowerMessage.includes('원해') || lowerMessage.includes('도입')) {
      intent = 'demand_search';
      entity = 'demand';
    }
  }
  
  return {
    primaryKeywords: keywords,
    serviceType: null,
    intent,
    queryType: intent === 'statistics' ? 'count' : 'search',
    context: { entity }
  };
}

export async function analyzeNaturalLanguage(message: string, openAIApiKey: string): Promise<KeywordAnalysis> {
  try {
    const analysisPrompt = `다음 사용자 질문을 분석해서 JSON 형태로만 응답해주세요 (다른 텍스트 없이):

사용자 질문: "${message}"

분석 규칙:
1. "수요", "도입", "필요", "구매" 등이 포함되면 → intent: "demand_search", entity: "demand"
2. "공급", "업체", "기업", "회사" 등이 포함되면 → intent: "supplier_search", entity: "supplier"  
3. "몇 개", "총", "개수", "통계"만 물어보면 → intent: "statistics"
4. primaryKeywords는 핵심 키워드 2-3개만 (불용어 제외)

응답 형식:
{
  "primaryKeywords": ["키워드1", "키워드2"],
  "serviceType": "AI서비스유형",
  "intent": "demand_search|supplier_search|statistics",
  "queryType": "search|count",
  "context": {
    "entity": "demand|supplier"
  }
}`;

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
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // JSON 마크다운 제거
    content = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    
    const analysisResult = JSON.parse(content);
    
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
    
    // 백업 분석 사용
    console.log('Using backup analysis...');
    return performBackupAnalysis(message);
  }
}
