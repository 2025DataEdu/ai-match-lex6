
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FileText, User } from "lucide-react";
import { SupplierEditModal } from "@/components/supplier/SupplierEditModal";
import { DemandEditModal } from "@/components/demand/DemandEditModal";
import { MyPageHeader } from "@/components/mypage/MyPageHeader";
import { SupplierTab } from "@/components/mypage/SupplierTab";
import { DemandTab } from "@/components/mypage/DemandTab";
import { ProfileTab } from "@/components/mypage/ProfileTab";
import { useMyPageData } from "@/hooks/useMyPageData";

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
  const {
    suppliers,
    demands,
    isLoading,
    fetchMyData,
    handleSupplierDelete,
    handleDemandDelete
  } = useMyPageData();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);

  const handleSupplierEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleDemandEdit = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDemandModalOpen(true);
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
        <MyPageHeader 
          suppliersCount={suppliers.length} 
          demandsCount={demands.length} 
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              내 정보
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              공급기업 ({suppliers.length})
            </TabsTrigger>
            <TabsTrigger value="demands" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              수요내용 ({demands.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <SupplierTab
              suppliers={suppliers}
              onEdit={handleSupplierEdit}
              onDelete={handleSupplierDelete}
            />
          </TabsContent>

          <TabsContent value="demands" className="space-y-4">
            <DemandTab
              demands={demands}
              onEdit={handleDemandEdit}
              onDelete={handleDemandDelete}
            />
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
