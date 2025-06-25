
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MatchingStats from "@/components/ai-matching/MatchingStats";
import MatchingCard from "@/components/ai-matching/MatchingCard";
import { Supplier, Demand, Match } from "@/types/matching";

const AIMatching = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliersResponse, demandsResponse] = await Promise.all([
        supabase.from('공급기업').select('*'),
        supabase.from('수요기관').select('*')
      ]);

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
    
    // 간단한 매칭 알고리즘 시뮬레이션
    setTimeout(() => {
      const newMatches: Match[] = [];
      
      demands.forEach(demand => {
        suppliers.forEach(supplier => {
          let score = 0;
          let reasons: string[] = [];

          // 유형 매칭
          if (supplier.유형 === demand.유형) {
            score += 40;
            reasons.push(`서비스 유형 일치 (${supplier.유형})`);
          }

          // 키워드 매칭 (간단한 예시)
          const demandKeywords = demand.수요내용?.toLowerCase().split(' ') || [];
          const supplierKeywords = supplier.세부설명?.toLowerCase().split(' ') || [];
          
          const commonKeywords = demandKeywords.filter(keyword => 
            supplierKeywords.some(sk => sk.includes(keyword) || keyword.includes(sk))
          );

          if (commonKeywords.length > 0) {
            score += Math.min(commonKeywords.length * 10, 30);
            reasons.push(`관련 키워드 발견 (${commonKeywords.length}개)`);
          }

          // 업종 관련성
          if (supplier.업종 && demand.수요내용?.includes(supplier.업종)) {
            score += 20;
            reasons.push(`업종 관련성`);
          }

          // 일정 점수 이상일 때만 매칭 결과에 포함
          if (score >= 30) {
            newMatches.push({
              supplier,
              demand,
              matchScore: Math.min(score, 100),
              matchReason: reasons.join(', ')
            });
          }
        });
      });

      // 점수 순으로 정렬하고 상위 10개만 표시
      const sortedMatches = newMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      setMatches(sortedMatches);
      setIsMatching(false);
      
      toast({
        title: "AI 매칭 완료",
        description: `${sortedMatches.length}개의 매칭 결과를 찾았습니다.`,
      });
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "높음";
    if (score >= 60) return "보통";
    return "낮음";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 매칭</h1>
          <p className="text-lg text-gray-600 mb-6">
            인공지능이 분석한 최적의 공급기업과 수요기관 매칭 결과를 확인하세요
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
                AI 매칭 시작
              </>
            )}
          </Button>
        </div>

        {/* 매칭 결과 */}
        {matches.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">매칭 결과</h2>
            {matches.map((match, index) => (
              <MatchingCard
                key={`${match.supplier['공급기업일련번호(PK)']}-${match.demand['수요기관일련번호(PK)']}`}
                match={match}
                index={index}
                getScoreColor={getScoreColor}
                getScoreText={getScoreText}
              />
            ))}
          </div>
        )}

        {/* 매칭 결과가 없을 때 */}
        {!isLoading && matches.length === 0 && !isMatching && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI 매칭을 시작해보세요
            </h3>
            <p className="text-gray-600">
              등록된 공급기업과 수요기관 정보를 바탕으로 최적의 매칭을 찾아드립니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatching;
