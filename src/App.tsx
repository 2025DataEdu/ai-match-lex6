
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SupplierRegistration from "./pages/SupplierRegistration";
import SupplierList from "./pages/SupplierList";
import DemandRegistration from "./pages/DemandRegistration";
import DemandList from "./pages/DemandList";
import AIMatching from "./pages/AIMatching";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = ({ session }: { session: Session | null }) => {
  return (
    <>
      <Routes>
        {!session ? (
          <Route path="*" element={<Auth />} />
        ) : (
          <>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Index />} />
            <Route path="/supplier-registration" element={<SupplierRegistration />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/demand-registration" element={<DemandRegistration />} />
            <Route path="/demands" element={<DemandList />} />
            <Route path="/ai-matching" element={<AIMatching />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </>
  );
};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 관리자 세션 확인
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          const parsedSession = JSON.parse(adminSession);
          setSession(parsedSession as Session);
          setLoading(false);
          return true;
        } catch (error) {
          localStorage.removeItem('admin_session');
        }
      }
      return false;
    };

    // 먼저 관리자 세션 확인
    if (checkAdminSession()) {
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // 로그아웃 시 관리자 세션도 제거
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('admin_session');
        }
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">AI매치허브</div>
          <div className="text-sm text-gray-500 mt-2">로딩 중...</div>
        </div>
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent session={session} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
