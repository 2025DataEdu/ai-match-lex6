
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import DemandFilters from "@/components/demand/DemandFilters";
import DemandHeader from "@/components/demand/DemandHeader";
import DemandEmptyState from "@/components/demand/DemandEmptyState";
import DemandGrid from "@/components/demand/DemandGrid";
import FloatingChatBot from "@/components/FloatingChatBot";
import { useDemandFilters } from "@/hooks/useDemandFilters";

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

const DemandList = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { filters, setFilters, filteredDemands, clearFilters } = useDemandFilters(demands);

  useEffect(() => {
    fetchDemands();
  }, []);

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
          description: `오류: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Successfully fetched demands:', data);
        const formattedData = (data || []).map(item => ({
          수요기관일련번호: item.수요기관일련번호,
          수요기관: item.수요기관 || '',
          부서명: item.부서명 || '',
          사용자명: item.사용자명 || '',
          유형: item.유형 || '',
          수요내용: item.수요내용 || '',
          금액: item.금액 || 0,
          시작일: item.시작일 || '',
          종료일: item.종료일 || '',
          기타요구사항: item.기타요구사항 || '',
          등록일자: item.등록일자 || ''
        }));
        setDemands(formattedData);
        toast({
          title: "데이터 새로고침 완료",
          description: `${formattedData.length}개의 수요 정보를 불러왔습니다.`,
        });
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

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <DemandHeader />
          
          <DemandFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            onRefresh={fetchDemands}
          />
        </div>

        {filteredDemands.length === 0 ? (
          <DemandEmptyState hasFilters={hasActiveFilters} />
        ) : (
          <DemandGrid demands={filteredDemands} />
        )}
      </div>
      <FloatingChatBot />
    </div>
  );
};

export default DemandList;
