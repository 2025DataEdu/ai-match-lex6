
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, Globe, Youtube, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Supplier {
  '공급기업일련번호(PK)': string;
  기업명: string;
  유형: string;
  업종: string;
  보유특허: string;
  기업홈페이지: string;
  유튜브링크: string;
  사용자명: string;
  세부설명: string;
  등록일자: string;
}

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = suppliers.filter(supplier =>
      supplier.기업명?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.유형?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.업종?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.세부설명?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    try {
      console.log('Fetching suppliers from Supabase...');
      const { data, error } = await supabase
        .from('공급기업')
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
        console.log('Successfully fetched suppliers:', data);
        setSuppliers(data || []);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">공급기업</h1>
          <p className="text-lg text-gray-600 mb-6">
            AI개발, 컨설팅, 교육 등 다양한 기술 서비스를 제공하는 기업들을 만나보세요
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="기업명, 서비스 유형, 업종으로 검색..."
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
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "검색 결과가 없습니다" : "등록된 공급기업이 없습니다"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "다른 검색어로 시도해보세요" : "첫 번째 공급기업을 등록해보세요"}
            </p>
            <Button asChild>
              <a href="/supplier-registration">공급기업 등록하기</a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier['공급기업일련번호(PK)']} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.기업명 || '기업명 없음'}</CardTitle>
                      <CardDescription>{supplier.사용자명 || '담당자명 없음'}</CardDescription>
                    </div>
                    {supplier.유형 && (
                      <Badge variant="secondary">{supplier.유형}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplier.업종 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{supplier.업종}</span>
                      </div>
                    )}
                    
                    {supplier.세부설명 && (
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {supplier.세부설명}
                      </p>
                    )}
                    
                    {supplier.보유특허 && (
                      <div className="text-sm">
                        <div className="flex items-center space-x-2 text-blue-600 mb-1">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">보유특허/인증</span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {supplier.보유특허}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      {supplier.기업홈페이지 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(supplier.기업홈페이지, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Globe className="w-3 h-3" />
                          <span>홈페이지</span>
                        </Button>
                      )}
                      {supplier.유튜브링크 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(supplier.유튜브링크, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Youtube className="w-3 h-3" />
                          <span>유튜브</span>
                        </Button>
                      )}
                    </div>

                    {supplier.등록일자 && (
                      <div className="pt-2 text-xs text-gray-500">
                        등록일: {formatDate(supplier.등록일자)}
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

export default SupplierList;
