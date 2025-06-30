
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';
import { formatEnhancedStatisticsResponse } from './responseFormatters/statisticsFormatter.ts';
import { formatEnhancedSupplierResponse } from './responseFormatters/supplierFormatter.ts';
import { formatEnhancedDemandResponse } from './responseFormatters/demandFormatter.ts';
import { 
  formatMatchingInfoResponse, 
  formatGeneralInfoResponse, 
  formatErrorResponse 
} from './responseFormatters/generalFormatter.ts';

export function formatIntelligentResponse(
  originalQuery: string, 
  analysis: KeywordAnalysis, 
  results: any[], 
  error: any = null
): string {
  if (error) {
    return formatErrorResponse(originalQuery, analysis);
  }

  // 의도별 정확한 응답 처리
  switch (analysis.intent) {
    case 'statistics':
      return formatEnhancedStatisticsResponse(originalQuery, analysis, results);
    case 'supplier_search':
      return formatEnhancedSupplierResponse(originalQuery, analysis, results);
    case 'demand_search':
      return formatEnhancedDemandResponse(originalQuery, analysis, results);
    case 'matching_info':
      return formatMatchingInfoResponse(originalQuery, analysis, results);
    case 'general_info':
      return formatGeneralInfoResponse(originalQuery, analysis);
    default:
      return formatEnhancedSupplierResponse(originalQuery, analysis, results);
  }
}
