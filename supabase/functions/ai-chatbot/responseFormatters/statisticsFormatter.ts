
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedStatisticsResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `📊 **통계 정보**\n\n현재 등록된 데이터가 없습니다.`;
  }

  const statData = results[0];
  let responseText = `📊 **데이터베이스 통계**\n\n`;
  
  // 전체 통계만 간단히 표시
  responseText += `🏢 **공급기업**: ${statData.totalSuppliers?.toLocaleString() || 0}곳\n`;
  responseText += `🏛️ **수요기관**: ${statData.totalDemands?.toLocaleString() || 0}곳\n`;
  
  // 키워드 필터링된 통계가 있는 경우만 추가
  if (statData.filteredStats && statData.searchTerms && statData.searchTerms.length > 0) {
    const searchKeyword = statData.searchTerms.join(', ');
    responseText += `\n🎯 **'${searchKeyword}' 관련**:\n`;
    responseText += `• 공급기업: ${statData.filteredStats.suppliers?.toLocaleString() || 0}곳\n`;
    responseText += `• 수요기관: ${statData.filteredStats.demands?.toLocaleString() || 0}곳`;
  }
  
  return responseText;
}
