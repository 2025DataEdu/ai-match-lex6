
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const ensureUserProfile = async (userId: string) => {
    try {
      console.log('Checking user profile for:', userId);
      
      // 사용자 프로필이 존재하는지 확인 - 올바른 컬럼명 사용
      const { data: existingProfile, error: checkError } = await supabase
        .from('회원관리')
        .select('*')
        .eq('아이디', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Profile check error:', checkError);
        throw checkError;
      }

      if (!existingProfile) {
        console.log('Profile not found, creating new profile for user:', userId);
        
        // 프로필이 없으면 생성
        const { error: insertError } = await supabase
          .from('회원관리')
          .insert({
            아이디: userId,
            등록일자: new Date().toISOString().split('T')[0]
          });

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw insertError;
        }
        
        console.log('Profile created successfully for user:', userId);
      } else {
        console.log('Profile already exists for user:', userId);
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      throw error;
    }
  };

  return { ensureUserProfile };
};
