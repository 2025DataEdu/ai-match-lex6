
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
  // 간단한 키워드 기반 분석으로 단순화
  const lowerMessage = message.toLowerCase();
  
  // 키워드 추출
  const words = lowerMessage.split(/\s+/);
  const keywords = words.filter(word => 
    word.length > 1 && 
    !['은', '는', '이', '가', '을', '를', '에', '의', '과', '와', '하고', '그리고', '또는', '있어', '있는', '해줘', '알려줘', '찾아줘', '추천'].includes(word)
  ).slice(0, 3);
  
  // 서비스 타입 간단 매핑
  let serviceType = null;
  if (lowerMessage.includes('챗봇') || lowerMessage.includes('대화')) {
    serviceType = '챗봇/대화형AI';
  } else if (lowerMessage.includes('cctv') || lowerMessage.includes('영상') || lowerMessage.includes('비전')) {
    serviceType = '컴퓨터비전/이미지AI';
  } else if (lowerMessage.includes('음성')) {
    serviceType = '음성인식/음성AI';
  } else if (lowerMessage.includes('로봇') || lowerMessage.includes('자동화')) {
    serviceType = '로봇/자동화AI';
  }
  
  // 의도 판단
  let intent = 'supplier_search';
  if (lowerMessage.includes('몇') || lowerMessage.includes('수') || lowerMessage.includes('개수')) {
    intent = 'statistics';
  } else if (lowerMessage.includes('수요')) {
    intent = 'demand_search';
  }
  
  return {
    primaryKeywords: keywords,
    serviceType,
    intent: intent as any,
    queryType: intent === 'statistics' ? 'count' : 'search',
    context: {
      entity: intent === 'demand_search' ? 'demand' : 'supplier'
    }
  };
}
