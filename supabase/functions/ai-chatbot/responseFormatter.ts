
export function formatResponse(message: string, queryResults: any[], queryError: any): string {
  let aiResponse = '';
  
  if (queryError) {
    aiResponse = `죄송합니다. 검색 중 오류가 발생했습니다. 다른 방법으로 질문해주세요.`;
  } else if (queryResults.length === 0) {
    aiResponse = `"${message}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보시겠어요?`;
  } else {
    // 간단하고 빠른 결과 정리
    aiResponse = `질문하신 "${message}"에 대한 검색 결과입니다.\n\n총 ${queryResults.length}개의 결과를 찾았습니다.\n\n`;
    
    queryResults.slice(0, 5).forEach((item: any, index: number) => {
      if (item.기업명) {
        aiResponse += `${index + 1}. **${item.기업명}**\n`;
        if (item.업종) aiResponse += `   - 업종: ${item.업종}\n`;
        if (item.세부설명) aiResponse += `   - 설명: ${item.세부설명.substring(0, 100)}...\n`;
      } else if (item.수요기관) {
        aiResponse += `${index + 1}. **${item.수요기관}**\n`;
        if (item.수요내용) aiResponse += `   - 수요내용: ${item.수요내용.substring(0, 100)}...\n`;
        if (item.금액) aiResponse += `   - 금액: ${(item.금액 / 10000).toFixed(0)}억원\n`;
      }
      aiResponse += '\n';
    });
    
    if (queryResults.length > 5) {
      aiResponse += `... 외 ${queryResults.length - 5}개의 추가 결과가 있습니다.\n\n`;
    }
  }

  aiResponse += `\n추가로 궁금한 것이 있으시면 언제든 질문해주세요!`;
  return aiResponse;
}

export function formatCachedResponse(message: string, cachedData: any[]): string {
  let aiResponse = '';
  
  if (cachedData && cachedData.length > 0) {
    aiResponse = `질문하신 "${message}"에 대한 검색 결과입니다.\n\n총 ${cachedData.length}개의 결과를 찾았습니다.\n\n`;
    
    cachedData.slice(0, 5).forEach((item: any, index: number) => {
      if (item.기업명) {
        aiResponse += `${index + 1}. **${item.기업명}**\n`;
        if (item.업종) aiResponse += `   - 업종: ${item.업종}\n`;
        if (item.세부설명) aiResponse += `   - 설명: ${item.세부설명.substring(0, 100)}...\n`;
      } else if (item.수요기관) {
        aiResponse += `${index + 1}. **${item.수요기관}**\n`;
        if (item.수요내용) aiResponse += `   - 수요내용: ${item.수요내용.substring(0, 100)}...\n`;
        if (item.금액) aiResponse += `   - 금액: ${(item.금액 / 10000).toFixed(0)}억원\n`;
      }
      aiResponse += '\n';
    });
  } else {
    aiResponse = `"${message}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보시겠어요?`;
  }
  
  return aiResponse;
}
