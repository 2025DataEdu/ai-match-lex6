
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Demand {
  '수요기관일련번호(PK)': string;
  수요기관: string;
  부서명: string;
  사용자명: string;
  유형: string;
  수요내용: string;
  금액: number;
  시작일: string;
  종료일: string;
  기타요구사항: string;
  등록일자: string;
}

const DemandList = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [filteredDemands, setFilteredDemands] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDemands();
  }, []);

  useEffect(() => {
    const filtered = demands.filter(demand =>
      demand.수요기관?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.유형?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.수요내용?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.부서명?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDemands(filtered);
  }, [searchTerm, demands]);

  const fetchDemands = async () => {
    try {
      console.log('Fetching demands from Supabase...');
      const { data, error } = await supabase
        .from('수요기관')
        .select('*')
        .order('등록일자', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "데이터 로드 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Successfully fetched demands:', data);
        setDemands(data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "오류 발생",
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('ko-KR').format(amount) + ' 만원';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">수요내용</h1>
          <p className="text-lg text-gray-600 mb-6">
            공공기관 및 기업체의 기술 서비스 수요를 확인해보세요
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="기관명, 수요 유형, 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDemands.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "검색 결과가 없습니다" : "등록된 수요내용이 없습니다"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "다른 검색어로 시도해보세요" : "첫 번째 수요를 등록해보세요"}
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href="/demand-registration">수요기관 등록하기</a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemands.map((demand) => (
              <Card key={demand['수요기관일련번호(PK)']} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{demand.수요기관 || '기관명 없음'}</CardTitle>
                      <CardDescription>
                        {demand.부서명 && `${demand.부서명} · `}{demand.사용자명 || '담당자명 없음'}
                      </CardDescription>
                    </div>
                    {demand.유형 && (
                      <Badge variant="secondary">{demand.유형}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demand.수요내용 && (
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {demand.수요내용}
                      </p>
                    )}
                    
                    {demand.금액 && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{formatCurrency(demand.금액)}</span>
                      </div>
                    )}

                    {(demand.시작일 || demand.종료일) && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {demand.시작일 && formatDate(demand.시작일)}
                          {demand.시작일 && demand.종료일 && ' ~ '}
                          {demand.종료일 && formatDate(demand.종료일)}
                        </span>
                      </div>
                    )}
                    
                    {demand.기타요구사항 && (
                      <div className="text-sm">
                        <div className="font-medium text-gray-700 mb-1">기타 요구사항</div>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {demand.기타요구사항}
                        </p>
                      </div>
                    )}

                    {demand.등록일자 && (
                      <div className="pt-2 text-xs text-gray-500">
                        등록일: {formatDate(demand.등록일자)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandList;
