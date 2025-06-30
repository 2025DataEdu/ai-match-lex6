
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Building2, FileText } from "lucide-react";
import { SupplierEditModal } from "@/components/supplier/SupplierEditModal";
import { DemandEditModal } from "@/components/demand/DemandEditModal";

interface Supplier {
  공급기업일련번호: string;
  기업명: string;
  사용자명: string;
  유형: string;
  업종: string;
  세부설명: string;
  등록일자: string;
}

interface Demand {
  수요기관일련번호: string;
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

const MyPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user?.email) return;

      const userId = session.session.user.email.split('@')[0];

      // 내가 등록한 공급기업 조회
      const { data: supplierData, error: supplierError } = await supabase
        .from('공급기업')
        .select('*')
        .eq('아이디', userId)
        .order('등록일자', { ascending: false });

      if (supplierError) {
        console.error('Supplier fetch error:', supplierError);
      } else {
        setSuppliers(supplierData || []);
      }

      // 내가 등록한 수요기관 조회
      const { data: demandData, error: demandError } = await supabase
        .from('수요기관')
        .select('*')
        .eq('아이디', userId)
        .order('등록일자', { ascending: false });

      if (demandError) {
        console.error('Demand fetch error:', demandError);
      } else {
        setDemands(demandData || []);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "데이터 로드 실패",
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleDemandEdit = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDemandModalOpen(true);
  };

  const handleSupplierDelete = async (supplierId: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('공급기업')
        .delete()
        .eq('공급기업일련번호', supplierId);

      if (error) {
        toast({
          title: "삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "삭제 완료",
          description: "공급기업이 성공적으로 삭제되었습니다.",
        });
        fetchMyData();
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDemandDelete = async (demandId: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('수요기관')
        .delete()
        .eq('수요기관일련번호', demandId);

      if (error) {
        toast({
          title: "삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "삭제 완료",
          description: "수요기관이 성공적으로 삭제되었습니다.",
        });
        fetchMyData();
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-gray-600 mt-2">내가 등록한 공급기업과 수요기관을 관리하세요</p>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              공급기업 ({suppliers.length})
            </TabsTrigger>
            <TabsTrigger value="demands" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              수요기관 ({demands.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4">
            {suppliers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">등록한 공급기업이 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {suppliers.map((supplier) => (
                  <Card key={supplier.공급기업일련번호}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{supplier.기업명}</CardTitle>
                          <CardDescription>
                            {supplier.유형} • {supplier.업종}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSupplierEdit(supplier)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSupplierDelete(supplier.공급기업일련번호)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{supplier.세부설명}</p>
                      <p className="text-xs text-gray-500">
                        담당자: {supplier.사용자명} • 등록일: {supplier.등록일자}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="demands" className="space-y-4">
            {demands.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">등록한 수요기관이 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {demands.map((demand) => (
                  <Card key={demand.수요기관일련번호}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{demand.수요기관}</CardTitle>
                          <CardDescription>
                            {demand.유형} • {demand.부서명}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDemandEdit(demand)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDemandDelete(demand.수요기관일련번호)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{demand.수요내용}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>담당자: {demand.사용자명}</span>
                        <span>예산: {demand.금액?.toLocaleString()}원</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        기간: {demand.시작일} ~ {demand.종료일} • 등록일: {demand.등록일자}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedSupplier && (
        <SupplierEditModal
          supplier={selectedSupplier}
          isOpen={isSupplierModalOpen}
          onClose={() => {
            setIsSupplierModalOpen(false);
            setSelectedSupplier(null);
          }}
          onUpdate={() => {
            fetchMyData();
            setIsSupplierModalOpen(false);
            setSelectedSupplier(null);
          }}
        />
      )}

      {selectedDemand && (
        <DemandEditModal
          demand={selectedDemand}
          isOpen={isDemandModalOpen}
          onClose={() => {
            setIsDemandModalOpen(false);
            setSelectedDemand(null);
          }}
          onUpdate={() => {
            fetchMyData();
            setIsDemandModalOpen(false);
            setSelectedDemand(null);
          }}
        />
      )}
    </div>
  );
};

export default MyPage;
