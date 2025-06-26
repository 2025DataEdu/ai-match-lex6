import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MatchingStats from "@/components/ai-matching/MatchingStats";
import EnhancedMatchingCard from "@/components/ai-matching/EnhancedMatchingCard";
import MatchingFilters from "@/components/ai-matching/MatchingFilters";
import { Supplier, Demand } from "@/types/matching";
import { calculateMatchingScore, DetailedMatch } from "@/utils/matchingAlgorithm";

const AIMatching = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [matches, setMatches] = useState<DetailedMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<DetailedMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);

  // 필터 상태
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 999999]);
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  // 필터링 및 정렬 적용
  useEffect(() => {
    let filtered = [...matches];

    // 업종 필터
    if (selectedIndustry !== "all") {
      filtered = filtered.filter(match => match.supplier.업종 === selectedIndustry);
    }

    // 점수 범위 필터
    filtered = filtered.filter(match => 
      match.matchScore >= scoreRange[0] && match.matchScore <= scoreRange[1]
    );

    // 예산 범위 필터
    filtered = filtered.filter(match => {
      if (!match.demand.금액) return true;
      return match.demand.금액 >= budgetRange[0] && match.demand.금액 <= budgetRange[1];
    });

    // 정렬
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "matchScore":
          aValue = a.matchScore;
          bValue = b.matchScore;
          break;
        case "등록일자":
          aValue = new Date(a.supplier.등록일자 || "").getTime() || 0;
          bValue = new Date(b.supplier.등록일자 || "").getTime() || 0;
          break;
        case "기업명":
          aValue = a.supplier.기업명 || "";
          bValue = b.supplier.기업명 || "";
          break;
        case "capabilityScore":
          aValue = a.capabilityScore;
          bValue = b.capabilityScore;
          break;
        default:
          aValue = a.matchScore;
          bValue = b.matchScore;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredMatches(filtered);
  }, [matches, selectedIndustry, scoreRange, budgetRange, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      const [suppliersResponse, demandsResponse] = await Promise.all([
        supabase.from('공급기업').select('*'),
        supabase.from('수요기관').select('*')
      ]);

      console.log('데이터 로드 결과:', {
        suppliers: suppliersResponse.data?.length || 0,
        demands: demandsResponse.data?.length || 0
      });

      if (suppliersResponse.error || demandsResponse.error) {
        toast({
          title: "데이터 로드 실패",
          description: "데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        setSuppliers(suppliersResponse.data || []);
        setDemands(demandsResponse.data || []);
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMatches = () => {
    setIsMatching(true);
    
    console.log('매칭 계산 시작:', { suppliers: suppliers.length, demands: demands.length });
    
    // 개선된 매칭 알고리즘 실행
    setTimeout(() => {
      const newMatches: DetailedMatch[] = [];
      
      demands.forEach(demand => {
        suppliers.forEach(supplier => {
          const match = calculateMatchingScore(demand, supplier);
          
          // 30점 이상일 때만 매칭 결과에 포함
          if (match.matchScore >= 30) {
            newMatches.push(match);
          }
        });
      });

      console.log('매칭 계산 완료:', { totalMatches: newMatches.length });

      // 점수 순으로 정렬하고 상위 20개만 표시
      const sortedMatches = newMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20);

      setMatches(sortedMatches);
      setIsMatching(false);
      
      toast({
        title: "AI 매칭 완료",
        description: `${sortedMatches.length}개의 매칭 결과를 찾았습니다.`,
      });
    }, 3000);
  };

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

  const clearFilters = () => {
    setSelectedIndustry("all");
    setScoreRange([0, 100]);
    setBudgetRange([0, 999999]);
    setSortBy("matchScore");
    setSortOrder("desc");
  };

  const hasActiveFilters = selectedIndustry !== "all" || 
    scoreRange[0] !== 0 || scoreRange[1] !== 100 ||
    budgetRange[0] !== 0 || budgetRange[1] !== 999999;

  const industries = Array.from(new Set(suppliers.map(s => s.업종).filter(Boolean)));

  console.log('현재 상태:', {
    isLoading,
    isMatching,
    matches: matches.length,
    filteredMatches: filteredMatches.length,
    suppliers: suppliers.length,
    demands: demands.length
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

        {/* 디버깅 정보 (개발 중에만 표시) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              디버깅 정보: 공급기업 {suppliers.length}개, 수요기관 {demands.length}개, 
              매칭결과 {matches.length}개, 필터링된 결과 {filteredMatches.length}개
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
            budgetRange={budgetRange}
            onBudgetRangeChange={setBudgetRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* 매칭 결과 - 스크롤 영역 추가 */}
        {filteredMatches.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                매칭 결과 ({filteredMatches.length}개)
              </h2>
            </div>
            
            <ScrollArea className="h-[800px] w-full">
              <div className="space-y-6 pr-4">
                {filteredMatches.map((match, index) => (
                  <EnhancedMatchingCard
                    key={`${match.supplier.공급기업일련번호}-${match.demand.수요기관일련번호}`}
                    match={match}
                    index={index}
                    onInterestClick={handleInterestClick}
                    onInquiryClick={handleInquiryClick}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* 매칭 결과가 없을 때 */}
        {!isLoading && matches.length === 0 && !isMatching && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              개선된 AI 매칭을 시작해보세요
            </h3>
            <p className="text-gray-600">
              키워드 유사도, 기업 역량, 예산 적합성을 종합 분석하여 최적의 매칭을 찾아드립니다
            </p>
          </div>
        )}

        {/* 필터링 후 결과가 없을 때 */}
        {matches.length > 0 && filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              필터 조건에 맞는 결과가 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              다른 필터 조건을 시도해보거나 필터를 초기화해보세요
            </p>
            <Button variant="outline" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatching;
