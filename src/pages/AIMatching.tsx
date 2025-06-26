
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MatchingStats from "@/components/ai-matching/MatchingStats";
import MatchingFilters from "@/components/ai-matching/MatchingFilters";
import MatchingResults from "@/components/ai-matching/MatchingResults";
import MatchingEmptyState from "@/components/ai-matching/MatchingEmptyState";
import { useAIMatching } from "@/hooks/useAIMatching";
import { DetailedMatch } from "@/utils/matchingAlgorithm";

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
    calculateMatches,
    clearFilters,
    hasActiveFilters,
    industries
  } = useAIMatching();

  const { toast } = useToast();

  const handleInterestClick = (match: DetailedMatch) => {
    toast({
      title: "관심표시 완료",
      description: `${match.supplier.기업명}에 관심표시를 보냈습니다.`,
    });
  };

  const handleInquiryClick = (match: DetailedMatch) => {
    toast({
      title: "문의 전송",
      description: `${match.supplier.기업명}에 문의를 전송했습니다.`,
    });
  };

  console.log('현재 상태:', {
    isLoading,
    isMatching,
    matches: matches.length,
    filteredMatches: filteredMatches.length,
    suppliers: suppliers.length,
    demands: demands.length,
    industries: industries.length
  });

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

        {/* 통계 카드 */}
        <MatchingStats 
          suppliersCount={suppliers.length}
          demandsCount={demands.length}
          matchesCount={matches.length}
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

        {/* 디버깅 정보 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              디버깅 정보: 공급기업 {suppliers.length}개, 수요기관 {demands.length}개, 
              매칭결과 {matches.length}개, 필터링된 결과 {filteredMatches.length}개, 
              업종 {industries.length}개
            </p>
          </div>
        )}

        {/* 필터 및 정렬 */}
        {matches.length > 0 && (
          <MatchingFilters
            industries={industries}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            scoreRange={scoreRange}
            onScoreRangeChange={setScoreRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* 매칭 결과 표시 */}
        {filteredMatches.length > 0 && (
          <MatchingResults
            matches={filteredMatches}
            onInterestClick={handleInterestClick}
            onInquiryClick={handleInquiryClick}
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
