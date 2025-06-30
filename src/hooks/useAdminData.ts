
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminSupplier {
  공급기업일련번호: string;
  기업명: string;
  사용자명: string;
  유형: string;
  업종: string;
  세부설명: string;
  등록일자: string;
  아이디: string;
}

interface AdminDemand {
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
  아이디: string;
}

interface AdminUser {
  아이디: string;
  이메일: string;
  이름: string;
  연락처: string;
  기업명: string;
  부서명: string;
  유형: string;
  등록일자: string;
}

export const useAdminData = () => {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [demands, setDemands] = useState<AdminDemand[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // 모든 공급기업 조회
      const { data: supplierData, error: supplierError } = await supabase
        .from('공급기업')
        .select('*')
        .order('등록일자', { ascending: false });

      if (supplierError) {
        console.error('Supplier fetch error:', supplierError);
      } else {
        setSuppliers(supplierData || []);
      }

      // 모든 수요기관 조회
      const { data: demandData, error: demandError } = await supabase
        .from('수요기관')
        .select('*')
        .order('등록일자', { ascending: false });

      if (demandError) {
        console.error('Demand fetch error:', demandError);
      } else {
        setDemands(demandData || []);
      }

      // 모든 사용자 조회
      const { data: userData, error: userError } = await supabase
        .from('회원관리')
        .select('*')
        .order('등록일자', { ascending: false });

      if (userError) {
        console.error('User fetch error:', userError);
      } else {
        setUsers(userData || []);
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
    fetchAllData();
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
        fetchAllData();
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
        fetchAllData();
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (!confirm('정말로 삭제하시겠습니까? 이 사용자의 모든 데이터가 삭제됩니다.')) return;

    try {
      const { error } = await supabase
        .from('회원관리')
        .delete()
        .eq('아이디', userId);

      if (error) {
        toast({
          title: "삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "삭제 완료",
          description: "사용자가 성공적으로 삭제되었습니다.",
        });
        fetchAllData();
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
    users,
    isLoading,
    fetchAllData,
    handleSupplierDelete,
    handleDemandDelete,
    handleUserDelete
  };
};
