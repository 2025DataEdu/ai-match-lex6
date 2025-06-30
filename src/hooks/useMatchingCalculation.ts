
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { calculateMatchingScore } from "@/utils/matchingAlgorithm";

export const useMatchingCalculation = () => {
  const [matches, setMatches] = useState<DetailedMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();

  const calculateMatches = (suppliers: Supplier[], demands: Demand[]) => {
    setIsMatching(true);
    
    console.log('매칭 계산 시작:', { 
      suppliers: suppliers.length, 
      demands: demands.length,
      samplesSuppliers: suppliers.slice(0, 2),
      sampleDemands: demands.slice(0, 2)
    });
    
    setTimeout(() => {
      const newMatches: DetailedMatch[] = [];
      
      demands.forEach(demand => {
        suppliers.forEach(supplier => {
          const match = calculateMatchingScore(demand, supplier);
          
          // 60점 이상일 때만 매칭 결과에 포함 (기준 상향)
          if (match.matchScore >= 60) {
            newMatches.push(match);
          }
        });
      });

      console.log('매칭 계산 완료:', { 
        totalMatches: newMatches.length,
        sampleMatches: newMatches.slice(0, 3).map(m => ({
          기업명: m.supplier.기업명,
          수요기관: m.demand.수요기관,
          매칭점수: m.matchScore
        }))
      });

      // 60점 이상의 매칭이 없을 경우 기준을 40점으로 낮춰서 재시도
      let finalMatches = newMatches;
      if (newMatches.length === 0) {
        console.log('60점 이상 매칭이 없어 기준을 40점으로 낮춤');
        demands.forEach(demand => {
          suppliers.forEach(supplier => {
            const match = calculateMatchingScore(demand, supplier);
            if (match.matchScore >= 40) {
              finalMatches.push(match);
            }
          });
        });
      }

      // 점수 순으로 정렬하고 상위 50개로 제한 (100개에서 50개로 축소)
      const sortedMatches = finalMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 50);

      setMatches(sortedMatches);
      setIsMatching(false);
      
      const minScore = finalMatches.length > 0 ? Math.min(...finalMatches.map(m => m.matchScore)) : 0;
      const maxScore = finalMatches.length > 0 ? Math.max(...finalMatches.map(m => m.matchScore)) : 0;
      
      toast({
        title: "AI 매칭 완료",
        description: `${sortedMatches.length}개의 고품질 매칭 결과를 찾았습니다. (점수 범위: ${minScore}~${maxScore}점)`,
      });
    }, 2000);
  };

  return {
    matches,
    isMatching,
    calculateMatches
  };
};
