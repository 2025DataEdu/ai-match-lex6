
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      // 관리자 세션 확인
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          const parsedSession = JSON.parse(adminSession);
          if (parsedSession.user?.email === 'admin@system.com') {
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          localStorage.removeItem('admin_session');
        }
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user?.email) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const userId = session.session.user.email.split('@')[0];

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Admin check error:', error);
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAdmin, isLoading, checkAdminStatus };
};
