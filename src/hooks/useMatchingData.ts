
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand } from "@/types/matching";

export const useMatchingData = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 공급기업 데이터를 별도로 가져온 후 회원관리 정보와 매칭
      const [suppliersResponse, demandsResponse, membersResponse] = await Promise.all([
        supabase.from('공급기업').select('*'),
        supabase.from('수요기관').select('*'),
        supabase.from('회원관리').select('*')
      ]);

      console.log('데이터 로드 결과:', {
        suppliers: suppliersResponse.data?.length || 0,
        demands: demandsResponse.data?.length || 0,
        members: membersResponse.data?.length || 0,
        suppliersData: suppliersResponse.data?.slice(0, 2),
        demandsData: demandsResponse.data?.slice(0, 2),
        membersData: membersResponse.data?.slice(0, 2)
      });

      if (suppliersResponse.error || demandsResponse.error || membersResponse.error) {
        console.error('데이터 로드 오류:', {
          suppliersError: suppliersResponse.error,
          demandsError: demandsResponse.error,
          membersError: membersResponse.error
        });
        toast({
          title: "데이터 로드 실패",
          description: "데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        // 회원관리 데이터를 맵으로 변환
        const membersMap = new Map();
        (membersResponse.data || []).forEach(member => {
          membersMap.set(member.아이디, member);
        });

        // 공급기업 데이터에 회원관리 정보 매칭
        const transformedSuppliers = (suppliersResponse.data || []).map(supplier => {
          const memberInfo = membersMap.get(supplier.아이디);
          return {
            ...supplier,
            이메일: memberInfo?.이메일 || null,
            연락처: memberInfo?.연락처 || null,
            사용자명: memberInfo?.이름 || supplier.사용자명
          };
        });

        console.log('변환된 공급기업 데이터 샘플:', transformedSuppliers.slice(0, 2));

        setSuppliers(transformedSuppliers);
        setDemands(demandsResponse.data || []);
      }
    } catch (error) {
      console.error('데이터 fetch 오류:', error);
      toast({
        title: "오류 발생",
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suppliers,
    demands,
    isLoading,
    refetch: fetchData
  };
};
