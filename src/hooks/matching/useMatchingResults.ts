
import { DetailedMatch } from "@/types/matching";
import { useToast } from "@/hooks/use-toast";

export const useMatchingResults = () => {
  const { toast } = useToast();

  const processMatchingResults = (allMatches: DetailedMatch[]): DetailedMatch[] => {
    console.log('매칭 결과 처리 시작:', { totalMatches: allMatches.length });

    // 1단계: 기본 품질 필터링 (0점 초과만)
    const validMatches = allMatches.filter(match => match.matchScore > 0);
    
    // 2단계: 수요기관별로 그룹화하고 상위 5개만 선택
    const demandGroups = new Map<string, DetailedMatch[]>();
    validMatches.forEach(match => {
      const demandId = match.demand.수요기관일련번호;
      if (!demandGroups.has(demandId)) {
        demandGroups.set(demandId, []);
      }
      demandGroups.get(demandId)!.push(match);
    });

    // 각 수요기관별로 상위 5개 매칭만 선택
    const demandFilteredMatches: DetailedMatch[] = [];
    demandGroups.forEach((matches, demandId) => {
      const sortedMatches = matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // 상위 5개만
      demandFilteredMatches.push(...sortedMatches);
    });

    // 3단계: 공급기업별로 그룹화하고 상위 5개만 선택
    const supplierGroups = new Map<string, DetailedMatch[]>();
    demandFilteredMatches.forEach(match => {
      const supplierId = match.supplier.공급기업일련번호;
      if (!supplierGroups.has(supplierId)) {
        supplierGroups.set(supplierId, []);
      }
      supplierGroups.get(supplierId)!.push(match);
    });

    // 각 공급기업별로 상위 5개 매칭만 선택
    const finalMatches: DetailedMatch[] = [];
    supplierGroups.forEach((matches, supplierId) => {
      const sortedMatches = matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // 상위 5개만
      finalMatches.push(...sortedMatches);
    });

    // 4단계: 최종 정렬
    const sortedMatches = finalMatches.sort((a, b) => b.matchScore - a.matchScore);

    console.log('개선된 매칭 최종 결과:', {
      원본매칭수: allMatches.length,
      유효매칭수: validMatches.length,
      수요기관수: demandGroups.size,
      공급기업수: supplierGroups.size,
      최종매칭수: sortedMatches.length,
      minScore: sortedMatches.length > 0 ? Math.min(...sortedMatches.map(m => m.matchScore)) : 0,
      maxScore: sortedMatches.length > 0 ? Math.max(...sortedMatches.map(m => m.matchScore)) : 0,
      avgScore: sortedMatches.length > 0 ? 
        (sortedMatches.reduce((sum, m) => sum + m.matchScore, 0) / sortedMatches.length).toFixed(1) : 0,
      keywordBasedMatches: sortedMatches.filter(m => m.matchedKeywords.length > 0).length
    });

    return sortedMatches;
  };

  const showMatchingResults = (sortedMatches: DetailedMatch[]) => {
    const minScore = sortedMatches.length > 0 ? Math.min(...sortedMatches.map(m => m.matchScore)) : 0;
    const maxScore = sortedMatches.length > 0 ? Math.max(...sortedMatches.map(m => m.matchScore)) : 0;
    const keywordMatches = sortedMatches.filter(m => m.matchedKeywords.length > 0).length;
    
    // 수요기관과 공급기업 수 계산
    const uniqueDemands = new Set(sortedMatches.map(m => m.demand.수요기관일련번호)).size;
    const uniqueSuppliers = new Set(sortedMatches.map(m => m.supplier.공급기업일련번호)).size;
    
    toast({
      title: "AI 매칭 완료",
      description: `${sortedMatches.length}개 매칭 (수요기관 ${uniqueDemands}개, 공급기업 ${uniqueSuppliers}개, 각각 최대 5개씩)`,
    });
  };

  return {
    processMatchingResults,
    showMatchingResults
  };
};
