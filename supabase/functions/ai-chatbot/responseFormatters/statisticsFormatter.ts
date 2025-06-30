
import { KeywordAnalysis } from '../naturalLanguageProcessor.ts';

export function formatEnhancedStatisticsResponse(query: string, analysis: KeywordAnalysis, results: any[]): string {
  if (!results || results.length === 0) {
    return `📊 **통계 정보**\n\n현재 등록된 데이터가 없습니다.\n\n**이용 가능한 통계 질문**:\n• "공급기업이 총 몇 곳이야?"\n• "AI 챗봇 업체는 몇 개야?"\n• "수요기관은 총 몇 곳 등록되어 있어?"\n• "CCTV 관련 기업 수는?"`;
  }

  const statData = results[0];
  let responseText = `📊 **현재 데이터베이스 통계**\n\n`;
  
  // 전체 통계 표시
  responseText += `🏢 **전체 공급기업**: ${statData.totalSuppliers?.toLocaleString() || 0}곳\n`;
  responseText += `🏛️ **전체 수요기관**: ${statData.totalDemands?.toLocaleString() || 0}곳\n\n`;
  
  // 필터링된 통계가 있는 경우
  if (statData.filteredStats && statData.searchTerms && statData.searchTerms.length > 0) {
    const searchKeyword = statData.searchTerms.join(', ');
    responseText += `🎯 **'${searchKeyword}' 관련 세부 통계**:\n`;
    responseText += `• 관련 공급기업: ${statData.filteredStats.suppliers?.toLocaleString() || 0}곳\n`;
    responseText += `• 관련 수요기관: ${statData.filteredStats.demands?.toLocaleString() || 0}곳\n\n`;
    
    // 비율 계산
    if (statData.totalSuppliers > 0) {
      const supplierRatio = ((statData.filteredStats.suppliers / statData.totalSuppliers) * 100).toFixed(1);
      responseText += `📈 **비율**: 전체 공급기업 중 ${supplierRatio}%가 ${searchKeyword} 관련 기업입니다.\n\n`;
    }
  }
  
  responseText += `📋 **추가 확인 가능한 통계**:\n`;
  responseText += `• "AI 챗봇 관련 기업은 몇 곳이야?"\n`;
  responseText += `• "CCTV 영상분석 업체 수는?"\n`;
  responseText += `• "음성인식 기술 보유 기업 통계는?"\n`;
  responseText += `• "로봇 개발 수요가 있는 기관은 몇 곳이야?"\n\n`;
  responseText += `더 구체적인 분야별 통계가 필요하시면 말씀해 주세요!`;
  
  return responseText;
}
