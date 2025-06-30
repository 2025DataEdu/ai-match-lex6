
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeeklyRegistration {
  week: string;
  공급기업: number;
  수요기관: number;
}

interface Stats {
  suppliersCount: number;
  demandsCount: number;
  matchesCount: number;
  matchingSuccessRate: number;
  weeklyRegistrations: WeeklyRegistration[];
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    suppliersCount: 0,
    demandsCount: 0,
    matchesCount: 0,
    matchingSuccessRate: 0,
    weeklyRegistrations: []
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

      // 최근 8주간 공급기업 등록 건수 조회
      const { data: suppliersByDate, error: suppliersDateError } = await supabase
        .from('공급기업')
        .select('등록일자')
        .not('등록일자', 'is', null)
        .order('등록일자', { ascending: false });

      // 최근 8주간 수요기관 등록 건수 조회
      const { data: demandsByDate, error: demandsDateError } = await supabase
        .from('수요기관')
        .select('등록일자')
        .not('등록일자', 'is', null)
        .order('등록일자', { ascending: false });

      if (suppliersError || demandsError || suppliersDateError || demandsDateError) {
        console.error('Stats fetch error:', suppliersError || demandsError || suppliersDateError || demandsDateError);
        toast({
          title: "통계 로드 실패",
          description: "통계 데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        // 주별 등록 건수 계산
        const weeklyRegistrations = calculateWeeklyRegistrations(suppliersByDate || [], demandsByDate || []);
        
        // 매칭 수는 현재는 임시로 계산 (나중에 실제 매칭 테이블이 생기면 수정)
        const matchesCount = Math.floor((suppliersCount || 0) * (demandsCount || 0) * 0.1);
        
        // localStorage에서 마지막 매칭 성공률 불러오기 (메인 페이지용)
        const savedSuccessRate = localStorage.getItem('lastMatchingSuccessRate');
        const matchingSuccessRate = savedSuccessRate ? parseInt(savedSuccessRate, 10) : 0;
        
        setStats({
          suppliersCount: suppliersCount || 0,
          demandsCount: demandsCount || 0,
          matchesCount: matchesCount,
          matchingSuccessRate: matchingSuccessRate,
          weeklyRegistrations: weeklyRegistrations
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

  const calculateWeeklyRegistrations = (suppliers: any[], demands: any[]): WeeklyRegistration[] => {
    // 최근 8주 기간 생성
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      weeks.push({
        start: weekStart,
        end: weekEnd,
        label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`
      });
    }

    // 주별 카운트 계산
    const weeklyData = weeks.map(week => {
      const supplierCount = suppliers.filter(s => {
        if (!s.등록일자) return false;
        const regDate = new Date(typeof s.등록일자 === 'string' ? s.등록일자.split('T')[0] : s.등록일자);
        return regDate >= week.start && regDate <= week.end;
      }).length;

      const demandCount = demands.filter(d => {
        if (!d.등록일자) return false;
        const regDate = new Date(typeof d.등록일자 === 'string' ? d.등록일자.split('T')[0] : d.등록일자);
        return regDate >= week.start && regDate <= week.end;
      }).length;

      return {
        week: week.label,
        공급기업: supplierCount,
        수요기관: demandCount
      };
    });

    return weeklyData;
  };

  // 실제 매칭 결과를 반영하여 성공률 업데이트 (메인 페이지 통계용)
  const updateMatchingSuccessRate = (actualMatchesCount: number, qualityMatchesCount: number) => {
    if (actualMatchesCount > 0) {
      const newSuccessRate = Math.round((qualityMatchesCount / actualMatchesCount) * 100);
      setStats(prev => ({
        ...prev,
        matchingSuccessRate: Math.min(100, Math.max(0, newSuccessRate))
      }));
    } else {
      // 매칭이 없으면 성공률 0%
      setStats(prev => ({
        ...prev,
        matchingSuccessRate: 0
      }));
    }
  };

  return { 
    stats, 
    isLoading, 
    fetchStats,
    updateMatchingSuccessRate
  };
};
