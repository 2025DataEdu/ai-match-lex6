
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  공급기업일련번호: string;
  기업명: string;
  유형: string;
  업종: string;
  세부설명: string;
  기업홈페이지?: string;
  유튜브링크?: string;
  보유특허?: string;
  사용자명?: string;
  등록일자?: string;
  아이디?: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("companyName");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (suppliers.length > 0) {
      let filtered = suppliers.filter(supplier =>
        supplier.기업명?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.유형?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.업종?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.세부설명?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.사용자명?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.보유특허?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // 정렬 적용
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case "companyName":
            aValue = a.기업명 || "";
            bValue = b.기업명 || "";
            break;
          case "registrationDate":
            aValue = new Date(a.등록일자 || "").getTime() || 0;
            bValue = new Date(b.등록일자 || "").getTime() || 0;
            break;
          case "유형":
            aValue = a.유형 || "";
            bValue = b.유형 || "";
            break;
          case "industry":
            aValue = a.업종 || "";
            bValue = b.업종 || "";
            break;
          case "특허유무":
            aValue = a.보유특허 ? 1 : 0;
            bValue = b.보유특허 ? 1 : 0;
            break;
          default:
            aValue = a.기업명 || "";
            bValue = b.기업명 || "";
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });

      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers([]);
    }
  }, [searchTerm, suppliers, sortBy, sortOrder]);

  const fetchSuppliers = async () => {
    try {
      console.log('공급기업 데이터 조회 시작...');
      setIsLoading(true);
      
      const { data, error, count } = await supabase
        .from('공급기업')
        .select('*', { count: 'exact' });

      console.log('Supabase 응답:', { data, error, count });

      if (error) {
        console.error('Supabase 에러:', error);
        toast({
          title: "데이터 로드 실패",
          description: `오류: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('조회된 공급기업 수:', data?.length || 0);
        
        if (data && data.length > 0) {
          const formattedData = data.map(item => ({
            공급기업일련번호: item.공급기업일련번호 || '',
            기업명: item.기업명 || '기업명 없음',
            유형: item.유형 || '유형 없음',
            업종: item.업종 || '업종 없음',
            세부설명: item.세부설명 || '',
            기업홈페이지: item.기업홈페이지,
            유튜브링크: item.유튜브링크,
            보유특허: item.보유특허,
            사용자명: item.사용자명,
            등록일자: item.등록일자,
            아이디: item.아이디
          }));
          
          console.log('포맷된 데이터:', formattedData);
          setSuppliers(formattedData);
          setFilteredSuppliers(formattedData);
          
          toast({
            title: "데이터 로드 완료",
            description: `${formattedData.length}개의 공급기업을 불러왔습니다.`,
          });
        } else {
          console.log('조회된 데이터가 없습니다. 테이블에 데이터가 있는지 확인하세요.');
          setSuppliers([]);
          setFilteredSuppliers([]);
          
          toast({
            title: "데이터 없음",
            description: "등록된 공급기업이 없습니다.",
          });
        }
      }
    } catch (error) {
      console.error('Fetch 에러:', error);
      toast({
        title: "오류 발생",
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log('현재 상태:', { 
    isLoading, 
    suppliersCount: suppliers.length, 
    filteredCount: filteredSuppliers.length 
  });

  return {
    suppliers,
    filteredSuppliers,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isLoading,
    fetchSuppliers
  };
};

export default useSuppliers;
