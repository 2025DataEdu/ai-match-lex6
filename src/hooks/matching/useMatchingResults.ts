
import { DetailedMatch } from "@/types/matching";
import { useToast } from "@/hooks/use-toast";

export const useMatchingResults = () => {
  const { toast } = useToast();

  const processMatchingResults = (allMatches: DetailedMatch[]): DetailedMatch[] => {
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

    return sortedMatches;
  };

  const showMatchingResults = (sortedMatches: DetailedMatch[]) => {
    const minScore = sortedMatches.length > 0 ? Math.min(...sortedMatches.map(m => m.matchScore)) : 0;
    const maxScore = sortedMatches.length > 0 ? Math.max(...sortedMatches.map(m => m.matchScore)) : 0;
    const keywordMatches = sortedMatches.filter(m => m.matchedKeywords.length > 0).length;
    
    toast({
      title: "AI 키워드 매칭 완료",
      description: `${sortedMatches.length}개의 매칭 결과 (키워드 기반: ${keywordMatches}개, 점수 범위: ${minScore}~${maxScore}점)`,
    });
  };

  return {
    processMatchingResults,
    showMatchingResults
  };
};
