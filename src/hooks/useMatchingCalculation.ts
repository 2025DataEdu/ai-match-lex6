
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { useMatchingKeywordExtraction } from "./matching/useKeywordExtraction";
import { useMatchingScoring } from "./matching/useMatchingScoring";
import { useMatchingResults } from "./matching/useMatchingResults";

export const useMatchingCalculation = () => {
  const [matches, setMatches] = useState<DetailedMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();
  
  const { isExtracting, extractRequiredKeywords } = useMatchingKeywordExtraction();
  const { calculateMatchingScores } = useMatchingScoring();
  const { processMatchingResults, showMatchingResults } = useMatchingResults();

  const calculateMatches = async (suppliers: Supplier[], demands: Demand[]) => {
    setIsMatching(true);
    
    console.log('개선된 AI 매칭 계산 시작:', { 
      suppliers: suppliers.length, 
      demands: demands.length
    });
    
    try {
      // 1단계: 키워드 추출
      const keywordExtractionSuccess = await extractRequiredKeywords(suppliers, demands);
      
      if (!keywordExtractionSuccess) {
        throw new Error('키워드 추출에 실패했습니다.');
      }

      // 2단계: 매칭 점수 계산
      const allMatches = calculateMatchingScores(demands, suppliers);

      // 3단계: 결과 처리 및 필터링
      const sortedMatches = processMatchingResults(allMatches);

      // 4단계: 상태 업데이트 및 결과 표시
      setMatches(sortedMatches);
      showMatchingResults(sortedMatches);

    } catch (error) {
      console.error('매칭 계산 오류:', error);
      toast({
        title: "매칭 계산 실패",
        description: "매칭 계산 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };

  return {
    matches,
    isMatching: isMatching || isExtracting,
    calculateMatches
  };
};
