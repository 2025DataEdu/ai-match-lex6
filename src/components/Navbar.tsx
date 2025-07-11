
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // 관리자 세션 확인
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          const parsedSession = JSON.parse(adminSession);
          setSession(parsedSession as Session);
          setUserName(parsedSession.user?.user_metadata?.name || "관리자");
          return true;
        } catch (error) {
          localStorage.removeItem('admin_session');
        }
      }
      return false;
    };

    if (checkAdminSession()) {
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        fetchUserName(session.user.email.split('@')[0]);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('admin_session');
      }
      setSession(session);
      if (session?.user?.email) {
        fetchUserName(session.user.email.split('@')[0]);
      } else {
        setUserName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserName = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('회원관리')
        .select('이름')
        .eq('아이디', userId)
        .single();

      if (!error && data) {
        setUserName(data['이름'] || "");
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handleSignOut = async () => {
    // 관리자 세션 확인
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      localStorage.removeItem('admin_session');
      navigate("/");
      window.location.reload();
      return;
    }

    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <TooltipProvider>
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-gray-900 text-2xl">경기도 수요-공급 매칭 플랫폼</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/suppliers"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                공급기업
              </Link>
              <Link
                to="/demands"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                수요내용
              </Link>
              <Link
                to="/ai-matching"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                AI매치
              </Link>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {userName || session.user.email?.split('@')[0] || "사용자"}
                    </span>
                  </div>
                  <Link to="/mypage">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <UserCircle className="w-4 h-4" />
                      <span>MY</span>
                    </Button>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="p-2"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>로그아웃</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth">로그인</Link>
                </Button>
              )}
            </div>

            {/* 나머지 모바일 메뉴 코드는 동일 */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <Link
                to="/suppliers"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                공급기업
              </Link>
              <Link
                to="/demands"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                수요내용
              </Link>
              <Link
                to="/ai-matching"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                AI매치
              </Link>
              {session ? (
                <div className="px-4 pt-2 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {userName || session.user.email?.split('@')[0] || "사용자"}
                    </span>
                  </div>
                  <Link
                    to="/mypage"
                    className="block py-2 text-gray-700 hover:bg-gray-50 rounded-md mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <UserCircle className="w-4 h-4" />
                      <span>MY</span>
                    </div>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="px-4 pt-2 border-t">
                  <Button asChild className="w-full">
                    <Link to="/auth">로그인</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default Navbar;
