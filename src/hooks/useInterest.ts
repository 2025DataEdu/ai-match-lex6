
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InterestData {
  공급기업일련번호: string;
  수요기관일련번호: string;
  관심수: number;
  사용자관심여부: boolean;
}

export const useInterest = () => {
  const [interests, setInterests] = useState<Map<string, InterestData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 관심 통계 조회
  const fetchInterestStats = async (matchPairs: { 공급기업일련번호: string; 수요기관일련번호: string }[]) => {
    if (matchPairs.length === 0) return;

    try {
      setIsLoading(true);
      
      // 현재 사용자 ID 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const interestMap = new Map<string, InterestData>();

      for (const pair of matchPairs) {
        const key = `${pair.공급기업일련번호}-${pair.수요기관일련번호}`;
        
        // 관심 통계 조회
        const { data: statsData } = await supabase
          .from('관심통계')
          .select('*')
          .eq('공급기업일련번호', pair.공급기업일련번호)
          .eq('수요기관일련번호', pair.수요기관일련번호)
          .maybeSingle();

        // 현재 사용자의 관심 여부 조회
        let userInterest = false;
        if (userId) {
          const { data: userInterestData } = await supabase
            .from('관심표시')
            .select('id')
            .eq('사용자아이디', userId)
            .eq('공급기업일련번호', pair.공급기업일련번호)
            .eq('수요기관일련번호', pair.수요기관일련번호)
            .maybeSingle();
          
          userInterest = !!userInterestData;
        }

        interestMap.set(key, {
          공급기업일련번호: pair.공급기업일련번호,
          수요기관일련번호: pair.수요기관일련번호,
          관심수: statsData?.관심수 || 0,
          사용자관심여부: userInterest
        });
      }

      setInterests(interestMap);
    } catch (error) {
      console.error('관심 통계 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 관심 토글
  const toggleInterest = async (공급기업일련번호: string, 수요기관일련번호: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "관심 표시를 위해 로그인이 필요합니다.",
          variant: "destructive",
        });
        return;
      }

      const key = `${공급기업일련번호}-${수요기관일련번호}`;
      const currentInterest = interests.get(key);
      
      if (currentInterest?.사용자관심여부) {
        // 관심 취소
        await supabase
          .from('관심표시')
          .delete()
          .eq('사용자아이디', user.id)
          .eq('공급기업일련번호', 공급기업일련번호)
          .eq('수요기관일련번호', 수요기관일련번호);

        setInterests(prev => {
          const newMap = new Map(prev);
          const updated = newMap.get(key);
          if (updated) {
            newMap.set(key, {
              ...updated,
              관심수: Math.max(0, updated.관심수 - 1),
              사용자관심여부: false
            });
          }
          return newMap;
        });

        toast({
          title: "관심 취소",
          description: "관심 표시가 취소되었습니다.",
        });
      } else {
        // 관심 추가
        await supabase
          .from('관심표시')
          .insert({
            사용자아이디: user.id,
            공급기업일련번호,
            수요기관일련번호
          });

        setInterests(prev => {
          const newMap = new Map(prev);
          const updated = newMap.get(key) || {
            공급기업일련번호,
            수요기관일련번호,
            관심수: 0,
            사용자관심여부: false
          };
          newMap.set(key, {
            ...updated,
            관심수: updated.관심수 + 1,
            사용자관심여부: true
          });
          return newMap;
        });

        toast({
          title: "관심 표시 완료",
          description: "관심 표시가 등록되었습니다.",
        });
      }
    } catch (error) {
      console.error('관심 토글 오류:', error);
      toast({
        title: "오류 발생",
        description: "관심 표시 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getInterestData = (공급기업일련번호: string, 수요기관일련번호: string): InterestData => {
    const key = `${공급기업일련번호}-${수요기관일련번호}`;
    return interests.get(key) || {
      공급기업일련번호,
      수요기관일련번호,
      관심수: 0,
      사용자관심여부: false
    };
  };

  return {
    interests,
    isLoading,
    fetchInterestStats,
    toggleInterest,
    getInterestData
  };
};
