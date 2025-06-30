
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedStatisticsResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `📊 **통계 정보**\n\n현재 등록된 데이터가 없습니다.`;
  }

  const statData = results[0];
  let responseText = `📊 **데이터베이스 통계**\n\n`;
  
  responseText += `🏢 **공급기업**: ${statData.totalSuppliers?.toLocaleString() || 0}곳\n`;
  responseText += `🏛️ **수요기관**: ${statData.totalDemands?.toLocaleString() || 0}곳`;
  
  return responseText;
}
