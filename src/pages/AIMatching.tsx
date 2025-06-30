
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MatchingStats from "@/components/ai-matching/MatchingStats";
import MatchingFilters from "@/components/ai-matching/MatchingFilters";
import MatchingResults from "@/components/ai-matching/MatchingResults";
import MatchingEmptyState from "@/components/ai-matching/MatchingEmptyState";
import { useAIMatching } from "@/hooks/useAIMatching";
import { useStats } from "@/hooks/useStats";
import { DetailedMatch } from "@/types/matching";
import { useEffect, useCallback, useRef, useState } from "react";

const AIMatching = () => {
  const {
    suppliers,
    demands,
    matches,
    filteredMatches,
    isLoading,
    isMatching,
    selectedIndustry,
    setSelectedIndustry,
    scoreRange,
    setScoreRange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    matchingPerspective,
    setMatchingPerspective,
    searchTerm,
    setSearchTerm,
    calculateMatches,
    clearFilters,
    hasActiveFilters,
    industries
  } = useAIMatching();

  const { stats, updateMatchingSuccessRate } = useStats();
  const { toast } = useToast();
  const lastMatchesLength = useRef(0);
  
  // AI 매칭 페이지에서의 매칭 성공률 (0%에서 시작)
  const [currentMatchingSuccessRate, setCurrentMatchingSuccessRate] = useState(0);

  // useCallback을 사용하여 함수 재생성 방지
  const handleMatchingSuccessRateUpdate = useCallback((totalMatches: number, qualityMatches: number) => {
    const successRate = totalMatches > 0 ? Math.round((qualityMatches / totalMatches) * 100) : 0;
    
    // AI 매칭 페이지의 현재 성공률 업데이트
    setCurrentMatchingSuccessRate(successRate);
    
    // 전역 통계 업데이트 (메인 페이지용)
    updateMatchingSuccessRate(totalMatches, qualityMatches);
    
    // localStorage에 매칭 성공률 저장 (메인 페이지에서 사용)
    localStorage.setItem('lastMatchingSuccessRate', successRate.toString());
  }, [updateMatchingSuccessRate]);

  // 매칭 결과가 변경될 때마다 실제 성공률 계산 (한 번만 실행되도록 개선)
  useEffect(() => {
    // 매칭 결과가 실제로 변경되었을 때만 실행
    if (matches.length > 0 && matches.length !== lastMatchesLength.current) {
      lastMatchesLength.current = matches.length;
      
      // 점수 분포 분석을 위한 디버깅 정보 (한 번만 출력)
      const scoreDistribution = {
        over80: matches.filter(match => match.matchScore >= 80).length,
        over70: matches.filter(match => match.matchScore >= 70).length,
        over60: matches.filter(match => match.matchScore >= 60).length,
        over50: matches.filter(match => match.matchScore >= 50).length,
        total: matches.length
      };
      
      console.log('매칭 점수 분포:', scoreDistribution);
      console.log('평균 점수:', matches.reduce((sum, match) => sum + match.matchScore, 0) / matches.length);
      console.log('최고 점수:', Math.max(...matches.map(match => match.matchScore)));
      console.log('최저 점수:', Math.min(...matches.map(match => match.matchScore)));
      
      // 더 엄격한 기준으로 고품질 매칭 판단 (70점 이상)
      const highQualityMatches = matches.filter(match => match.matchScore >= 70);
      
      console.log('고품질 매칭 (70점 이상):', highQualityMatches.length);
      
      // 실제로 의미있는 매칭만 성공으로 간주 (70점 이상)
      handleMatchingSuccessRateUpdate(matches.length, highQualityMatches.length);
    } else if (matches.length === 0 && lastMatchesLength.current > 0) {
      // 매칭이 초기화된 경우
      lastMatchesLength.current = 0;
      setCurrentMatchingSuccessRate(0);
    }
  }, [matches.length, handleMatchingSuccessRateUpdate]);

  const handleInterestClick = (match: DetailedMatch) => {
    // 관심표시는 카드 내부에서 처리됨
    console.log('관심표시 클릭:', match.supplier.기업명);
  };

  const handleInquiryClick = (match: DetailedMatch) => {
    toast({
      title: "문의 전송",
      description: `${match.supplier.기업명}에 문의를 전송했습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 매칭</h1>
          <p className="text-lg text-gray-600 mb-6">
            개선된 인공지능 알고리즘으로 분석한 최적의 공급기업과 수요기관 매칭 결과
          </p>
        </div>

        {/* 통계 카드 - AI 매칭 페이지에서는 현재 매칭 성공률 표시 */}
        <MatchingStats 
          suppliersCount={suppliers.length}
          demandsCount={demands.length}
          matchingSuccessRate={currentMatchingSuccessRate}
        />

        {/* 매칭 시작 버튼 */}
        <div className="text-center mb-8">
          <Button
            onClick={calculateMatches}
            disabled={isMatching || isLoading}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                AI 매칭 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                개선된 AI 매칭 시작
              </>
            )}
          </Button>
        </div>

        {/* 필터 및 정렬 */}
        {matches.length > 0 && (
          <MatchingFilters
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            scoreRange={scoreRange}
            onScoreRangeChange={setScoreRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            matchingPerspective={matchingPerspective}
            onMatchingPerspectiveChange={setMatchingPerspective}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            industries={industries}
          />
        )}

        {/* 매칭 결과 표시 */}
        {filteredMatches.length > 0 && (
          <MatchingResults
            matches={filteredMatches}
            onInterestClick={handleInterestClick}
            onInquiryClick={handleInquiryClick}
            perspective={matchingPerspective}
          />
        )}

        {/* 빈 상태 처리 */}
        {!isLoading && matches.length === 0 && !isMatching && (
          <MatchingEmptyState type="no-matches" />
        )}

        {matches.length > 0 && filteredMatches.length === 0 && (
          <MatchingEmptyState type="no-filtered-results" onClearFilters={clearFilters} />
        )}
      </div>
    </div>
  );
};

export default AIMatching;
