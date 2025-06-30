
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useMyPageData = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchMyData();
  }, []);

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
          description: "수요내용이 성공적으로 삭제되었습니다.",
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

  return {
    suppliers,
    demands,
    isLoading,
    fetchMyData,
    handleSupplierDelete,
    handleDemandDelete
  };
};
