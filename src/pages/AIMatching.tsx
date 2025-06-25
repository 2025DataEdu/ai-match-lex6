
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, Users, ArrowRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Supplier {
  '공급기업일련번호(PK)': string;
  기업명: string;
  유형: string;
  업종: string;
  세부설명: string;
}

interface Demand {
  '수요기관일련번호(PK)': string;
  수요기관: string;
  유형: string;
  수요내용: string;
  금액: number;
}

interface Match {
  supplier: Supplier;
  demand: Demand;
  matchScore: number;
  matchReason: string;
}

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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
                  <p className="text-sm text-gray-600">등록된 공급기업</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{demands.length}</p>
                  <p className="text-sm text-gray-600">등록된 수요기관</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                  <p className="text-sm text-gray-600">AI 매칭 결과</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <Card key={`${match.supplier['공급기업일련번호(PK)']}-${match.demand['수요기관일련번호(PK)']}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">매칭 #{index + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getScoreColor(match.matchScore)}`}></div>
                      <Badge variant="secondary">
                        매칭도: {match.matchScore}% ({getScoreText(match.matchScore)})
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {match.matchReason}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 공급기업 정보 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        공급기업
                      </h4>
                      <div className="space-y-2">
                        <p className="font-medium">{match.supplier.기업명}</p>
                        <Badge variant="outline">{match.supplier.유형}</Badge>
                        {match.supplier.업종 && (
                          <p className="text-sm text-gray-600">업종: {match.supplier.업종}</p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {match.supplier.세부설명}
                        </p>
                      </div>
                    </div>

                    {/* 수요기관 정보 */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        수요기관
                      </h4>
                      <div className="space-y-2">
                        <p className="font-medium">{match.demand.수요기관}</p>
                        <Badge variant="outline">{match.demand.유형}</Badge>
                        {match.demand.금액 && (
                          <p className="text-sm text-gray-600">
                            예산: {new Intl.NumberFormat('ko-KR').format(match.demand.금액)} 만원
                          </p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {match.demand.수요내용}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <span>상세 매칭 정보</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
