
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const ensureUserProfile = async (userEmail: string) => {
    try {
      const userId = userEmail.split('@')[0]; // 이메일의 @ 앞부분을 아이디로 사용
      console.log('Checking user profile for userId:', userId);
      
      // 사용자 프로필이 존재하는지 확인
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
        console.log('Profile not found, creating new profile for userId:', userId);
        
        // 프로필이 없으면 생성 (트리거에서 이미 생성되었을 것이므로 이 경우는 거의 없을 것임)
        const { error: insertError } = await supabase
          .from('회원관리')
          .insert({
            아이디: userId,
            이메일: userEmail,
            등록일자: new Date().toISOString().split('T')[0]
          });

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw insertError;
        }
        
        console.log('Profile created successfully for userId:', userId);
      } else {
        console.log('Profile already exists for userId:', userId);
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      throw error;
    }
  };

  return { ensureUserProfile };
};
