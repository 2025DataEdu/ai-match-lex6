
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { calculateEnhancedMatching } from "@/utils/enhancedMatchingAlgorithm";

export const useMatchingScoring = () => {
  const calculateMatchingScores = (demands: Demand[], suppliers: Supplier[]): DetailedMatch[] => {
    console.log('매칭 계산 시작...');
    const allMatches = calculateEnhancedMatching(demands, suppliers);

    console.log('매칭 계산 완료:', {
      totalMatches: allMatches.length,
      scoreDistribution: {
        over50: allMatches.filter(m => m.matchScore >= 50).length,
        over30: allMatches.filter(m => m.matchScore >= 30).length,
        over20: allMatches.filter(m => m.matchScore >= 20).length,
        over10: allMatches.filter(m => m.matchScore >= 10).length,
      }
    });

    return allMatches;
  };

  return {
    calculateMatchingScores
  };
};
