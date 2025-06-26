
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand } from "@/types/matching";
import { calculateMatchingScore, DetailedMatch } from "@/utils/matchingAlgorithm";

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
          
          // 20점 이상일 때만 매칭 결과에 포함
          if (match.matchScore >= 20) {
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

      // 점수 순으로 정렬하고 상위 100개 표시
      const sortedMatches = newMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 100);

      setMatches(sortedMatches);
      setIsMatching(false);
      
      toast({
        title: "AI 매칭 완료",
        description: `${sortedMatches.length}개의 매칭 결과를 찾았습니다.`,
      });
    }, 2000);
  };

  return {
    matches,
    isMatching,
    calculateMatches
  };
};
