
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  suppliersCount: number;
  demandsCount: number;
  matchesCount: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    suppliersCount: 0,
    demandsCount: 0,
    matchesCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // 공급기업 수 조회
      const { count: suppliersCount, error: suppliersError } = await supabase
        .from('공급기업')
        .select('*', { count: 'exact', head: true });

      // 수요기관 수 조회
      const { count: demandsCount, error: demandsError } = await supabase
        .from('수요기관')
        .select('*', { count: 'exact', head: true });

      if (suppliersError || demandsError) {
        console.error('Stats fetch error:', suppliersError || demandsError);
        toast({
          title: "통계 로드 실패",
          description: "통계 데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        // 매칭 수는 현재는 임시로 계산 (나중에 실제 매칭 테이블이 생기면 수정)
        const matchesCount = Math.floor((suppliersCount || 0) * (demandsCount || 0) * 0.1);
        
        setStats({
          suppliersCount: suppliersCount || 0,
          demandsCount: demandsCount || 0,
          matchesCount: matchesCount
        });
      }
    } catch (error) {
      console.error('Stats fetch catch error:', error);
      toast({
        title: "오류 발생",
        description: "통계 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, fetchStats };
};
