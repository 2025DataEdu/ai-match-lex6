
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { useUserProfile } from "./useUserProfile";

interface DemandFormData {
  organization: string;
  department: string;
  username: string;
  type: string;
  demandContent: string;
  budget: string;
  startDate: string;
  endDate: string;
  additionalRequirements: string;
}

export const useDemandRegistration = (session: Session | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ensureUserProfile } = useUserProfile();

  const [formData, setFormData] = useState<DemandFormData>({
    organization: "",
    department: "",
    username: "",
    type: "",
    demandContent: "",
    budget: "",
    startDate: "",
    endDate: "",
    additionalRequirements: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      toast({
        title: "인증 오류",
        description: "로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userEmail = session.user.email;
      const userId = userEmail.split('@')[0]; // 이메일의 @ 앞부분을 아이디로 사용
      
      console.log('Starting demand registration for userId:', userId);
      
      // 먼저 사용자 프로필이 존재하는지 확인하고 없으면 생성
      await ensureUserProfile(userEmail);
      
      console.log('Submitting demand data:', formData);
      
      // 수요기관 데이터 삽입
      const insertData = {
        수요기관일련번호: crypto.randomUUID(),
        아이디: userId,
        수요기관: formData.organization,
        부서명: formData.department || null,
        사용자명: formData.username,
        유형: formData.type,
        수요내용: formData.demandContent,
        금액: formData.budget ? parseInt(formData.budget) : null,
        시작일: formData.startDate || null,
        종료일: formData.endDate || null,
        기타요구사항: formData.additionalRequirements || null,
        등록일자: new Date().toISOString().split('T')[0],
        관심여부: 'N'
      };

      console.log('Insert data:', insertData);

      const { error } = await supabase
        .from('수요기관')
        .insert(insertData);

      if (error) {
        console.error('Demand registration error:', error);
        toast({
          title: "등록 실패",
          description: `등록 중 오류가 발생했습니다: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "등록 성공",
          description: "수요기관이 성공적으로 등록되었습니다.",
        });
        navigate("/demands");
      }
    } catch (error: any) {
      console.error('Demand registration catch error:', error);
      toast({
        title: "오류 발생",
        description: `등록 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleSubmit
  };
};
