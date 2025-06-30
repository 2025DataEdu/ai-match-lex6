
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand } from "@/types/matching";
import { useKeywordExtraction } from "@/hooks/useKeywordExtraction";

export const useMatchingKeywordExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const { batchExtractKeywords } = useKeywordExtraction();

  const extractRequiredKeywords = async (suppliers: Supplier[], demands: Demand[]) => {
    setIsExtracting(true);
    
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

      return true;
    } catch (error) {
      console.error('키워드 추출 오류:', error);
      toast({
        title: "키워드 추출 실패",
        description: "키워드 추출 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    isExtracting,
    extractRequiredKeywords
  };
};
