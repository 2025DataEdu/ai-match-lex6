
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { calculateEnhancedMatchingScore } from "./matching/matchScoreCalculator";

// 전체 매칭 계산 실행
export const calculateEnhancedMatching = (demands: Demand[], suppliers: Supplier[]): DetailedMatch[] => {
  const matches: DetailedMatch[] = [];
  
  console.log('개선된 키워드 기반 매칭 계산 시작:', { 
    demands: demands.length, 
    suppliers: suppliers.length,
    keywordExtractedSuppliers: suppliers.filter(s => s.추출키워드).length,
    keywordExtractedDemands: demands.filter(d => d.추출키워드).length
  });

  demands.forEach(demand => {
    suppliers.forEach(supplier => {
      const match = calculateEnhancedMatchingScore(demand, supplier);
      matches.push(match);
    });
  });

  const validMatches = matches.filter(m => m.matchScore > 0);
  
  console.log('개선된 매칭 결과:', {
    total: matches.length,
    withScore: validMatches.length,
    scoreDistribution: {
      over50: validMatches.filter(m => m.matchScore >= 50).length,
      over30: validMatches.filter(m => m.matchScore >= 30).length,
      over20: validMatches.filter(m => m.matchScore >= 20).length,
      over10: validMatches.filter(m => m.matchScore >= 10).length,
    }
  });

  return matches;
};

// 개별 매칭 점수 계산 함수도 export (기존 호환성 유지)
export { calculateEnhancedMatchingScore } from "./matching/matchScoreCalculator";
