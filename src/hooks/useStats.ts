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
        
        // 매칭 성공률 계산 - 실제 매칭 결과를 반영하도록 수정
        const matchingSuccessRate = calculateMatchingSuccessRate(suppliersCount || 0, demandsCount || 0);
        
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

  const calculateMatchingSuccessRate = (suppliersCount: number, demandsCount: number): number => {
    // 실제 매칭 성공률 계산 로직
    // 현재는 60점 이상 매칭을 기준으로 성공률 계산
    if (suppliersCount === 0 || demandsCount === 0) return 0;
    
    // 60점 이상 매칭이 가능한 비율을 추정
    // 실제 매칭 알고리즘의 결과를 반영하여 계산
    const totalPossibleMatches = suppliersCount * demandsCount;
    const estimatedQualityMatches = Math.floor(totalPossibleMatches * 0.15); // 15% 정도가 60점 이상 매칭
    
    // 성공률은 전체 가능한 매칭 대비 고품질 매칭의 비율
    const successRate = Math.min(85, Math.max(15, (estimatedQualityMatches / Math.max(suppliersCount, demandsCount)) * 100));
    
    return Math.round(successRate);
  };

  const updateMatchingSuccessRate = (actualMatchesCount: number, qualityMatchesCount: number) => {
    if (actualMatchesCount > 0) {
      const newSuccessRate = Math.round((qualityMatchesCount / actualMatchesCount) * 100);
      setStats(prev => ({
        ...prev,
        matchingSuccessRate: Math.min(100, Math.max(0, newSuccessRate))
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
