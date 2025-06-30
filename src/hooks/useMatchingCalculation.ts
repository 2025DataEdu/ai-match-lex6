
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { calculateEnhancedMatching } from "@/utils/enhancedMatchingAlgorithm";
import { useKeywordExtraction } from "@/hooks/useKeywordExtraction";

export const useMatchingCalculation = () => {
  const [matches, setMatches] = useState<DetailedMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();
  const { batchExtractKeywords, isExtracting } = useKeywordExtraction();

  const calculateMatches = async (suppliers: Supplier[], demands: Demand[]) => {
    setIsMatching(true);
    
    console.log('개선된 AI 매칭 계산 시작:', { 
      suppliers: suppliers.length, 
      demands: demands.length
    });
    
    try {
      // 키워드가 추출되지 않은 레코드들을 찾아서 추출
      const suppliersNeedingKeywords = suppliers.filter(s => 
        !s.추출키워드 && s.세부설명 && s.세부설명.trim().length > 10
      );
      
      const demandsNeedingKeywords = demands.filter(d => 
        !d.추출키워드 && d.수요내용 && d.수요내용.trim().length > 10
      );

      console.log('키워드 추출 필요:', {
        suppliers: suppliersNeedingKeywords.length,
        demands: demandsNeedingKeywords.length
      });

      // 키워드 추출이 필요한 경우
      if (suppliersNeedingKeywords.length > 0 || demandsNeedingKeywords.length > 0) {
        toast({
          title: "AI 키워드 추출 중",
          description: `${suppliersNeedingKeywords.length + demandsNeedingKeywords.length}개 항목의 키워드를 추출하고 있습니다...`,
        });

        // 공급기업 키워드 추출
        const supplierExtractionTasks = suppliersNeedingKeywords.map(supplier => ({
          id: supplier.공급기업일련번호,
          text: supplier.세부설명 || '',
          type: 'supplier' as const
        }));

        // 수요기관 키워드 추출
        const demandExtractionTasks = demandsNeedingKeywords.map(demand => ({
          id: demand.수요기관일련번호,
          text: demand.수요내용 || '',
          type: 'demand' as const
        }));

        // 배치로 키워드 추출 (API 비용 최소화를 위해 순차 처리)
        const extractionResults = await batchExtractKeywords([...supplierExtractionTasks, ...demandExtractionTasks]);
        
        console.log('키워드 추출 완료:', extractionResults);
        
        // 추출된 키워드를 기존 데이터에 반영
        extractionResults.forEach(result => {
          if (result.keywords) {
            // 공급기업 데이터 업데이트
            const supplier = suppliers.find(s => s.공급기업일련번호 === result.id);
            if (supplier) {
              supplier.추출키워드 = result.keywords;
              supplier.키워드추출상태 = 'completed';
            }
            
            // 수요기관 데이터 업데이트
            const demand = demands.find(d => d.수요기관일련번호 === result.id);
            if (demand) {
              demand.추출키워드 = result.keywords;
              demand.키워드추출상태 = 'completed';
            }
          }
        });

        toast({
          title: "키워드 추출 완료",
          description: "AI가 핵심 키워드를 추출했습니다. 매칭을 계속 진행합니다.",
        });
      }

      // 매칭 계산 실행 (키워드 추출 후 또는 기존 키워드가 있는 경우)
      console.log('매칭 계산 시작...');
      const allMatches = calculateEnhancedMatching(demands, suppliers);

      // 점수 기준을 단계별로 적용하여 최적의 매칭 결과 선택
      let finalMatches: DetailedMatch[] = [];
      
      // 1차: 30점 이상
      finalMatches = allMatches.filter(match => match.matchScore >= 30);
      
      // 2차: 20점 이상 (30점 이상이 부족할 경우)
      if (finalMatches.length < 20) {
        finalMatches = allMatches.filter(match => match.matchScore >= 20);
      }
      
      // 3차: 10점 이상 (20점 이상이 부족할 경우)
      if (finalMatches.length < 10) {
        finalMatches = allMatches.filter(match => match.matchScore >= 10);
      }
      
      // 4차: 5점 이상 (10점 이상이 부족할 경우)
      if (finalMatches.length < 5) {
        finalMatches = allMatches.filter(match => match.matchScore >= 5);
      }
      
      // 5차: 0점 초과 (모든 점수가 낮을 경우)
      if (finalMatches.length === 0) {
        finalMatches = allMatches.filter(match => match.matchScore > 0);
      }
      
      // 최종적으로 매칭이 없으면 상위 20개라도 표시
      if (finalMatches.length === 0) {
        finalMatches = allMatches
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 20);
      }

      // 점수 순으로 정렬하고 상위 100개로 제한
      const sortedMatches = finalMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 100);

      console.log('개선된 매칭 최종 결과:', {
        selectedMatches: sortedMatches.length,
        minScore: sortedMatches.length > 0 ? Math.min(...sortedMatches.map(m => m.matchScore)) : 0,
        maxScore: sortedMatches.length > 0 ? Math.max(...sortedMatches.map(m => m.matchScore)) : 0,
        avgScore: sortedMatches.length > 0 ? 
          (sortedMatches.reduce((sum, m) => sum + m.matchScore, 0) / sortedMatches.length).toFixed(1) : 0,
        keywordBasedMatches: sortedMatches.filter(m => m.matchedKeywords.length > 0).length
      });

      setMatches(sortedMatches);
      
      const minScore = sortedMatches.length > 0 ? Math.min(...sortedMatches.map(m => m.matchScore)) : 0;
      const maxScore = sortedMatches.length > 0 ? Math.max(...sortedMatches.map(m => m.matchScore)) : 0;
      const keywordMatches = sortedMatches.filter(m => m.matchedKeywords.length > 0).length;
      
      toast({
        title: "AI 키워드 매칭 완료",
        description: `${sortedMatches.length}개의 매칭 결과 (키워드 기반: ${keywordMatches}개, 점수 범위: ${minScore}~${maxScore}점)`,
      });

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
