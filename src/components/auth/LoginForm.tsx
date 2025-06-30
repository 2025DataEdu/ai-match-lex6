
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 이메일이 admin@system.com인 경우 회원관리 테이블에서 직접 인증
      if (loginData.email === 'admin@system.com') {
        const { data, error } = await supabase
          .from('회원관리')
          .select('*')
          .eq('이메일', loginData.email)
          .eq('비밀번호', loginData.password)
          .single();

        if (error || !data) {
          toast({
            title: "로그인 실패",
            description: "아이디 또는 비밀번호가 올바르지 않습니다.",
            variant: "destructive",
          });
          return;
        }

        // 관리자 로그인 성공 시 가짜 세션 생성
        const adminSession = {
          user: {
            id: data.아이디,
            email: data.이메일,
            user_metadata: {
              name: data.이름,
              company: data.기업명
            }
          }
        };

        // 로컬 스토리지에 관리자 세션 저장
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
        
        toast({
          title: "관리자 로그인 성공",
          description: "관리자로 로그인되었습니다.",
        });

        // 페이지 새로고침으로 세션 상태 반영
        window.location.reload();
        return;
      }

      // 일반 사용자의 경우 Supabase Auth 사용
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "로그인 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
};

export default LoginForm;
