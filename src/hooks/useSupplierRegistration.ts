
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "@/components/supplier/SupplierRegistrationForm";

export const useSupplierRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    type: "",
    industry: "",
    patents: "",
    website: "",
    youtubeLinks: [""],
    username: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) return;

    setIsLoading(true);

    try {
      const userEmail = session.user.email;
      const userId = userEmail.split('@')[0];
      
      console.log('Submitting supplier data for userId:', userId, formData);
      
      // 빈 유튜브 링크 제거 후 문자열로 결합
      const validYoutubeLinks = formData.youtubeLinks.filter(link => link.trim() !== "");
      const youtubeLinksString = validYoutubeLinks.join(", ");
      
      const { error } = await supabase
        .from('공급기업')
        .insert({
          '공급기업일련번호': crypto.randomUUID(),
          '아이디': userId,
          '기업명': formData.companyName,
          '유형': formData.type,
          '업종': formData.industry,
          '보유특허': formData.patents || null,
          '기업홈페이지': formData.website || null,
          '유튜브링크': youtubeLinksString || null,
          '사용자명': formData.username,
          '세부설명': formData.description,
          '등록일자': new Date().toISOString().split('T')[0],
          '관심여부': 'N',
          '문의여부': 'N'
        });

      if (error) {
        console.error('Supplier registration error:', error);
        toast({
          title: "등록 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "등록 성공",
          description: "공급기업이 성공적으로 등록되었습니다.",
        });
        navigate("/suppliers");
      }
    } catch (error) {
      console.error('Supplier registration catch error:', error);
      toast({
        title: "오류 발생",
        description: "등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    isLoading
  };
};
