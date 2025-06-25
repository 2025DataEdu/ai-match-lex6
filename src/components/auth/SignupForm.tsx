
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const { toast } = useToast();
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    company: "",
    phone: "",
    type: ""
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "비밀번호 확인",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!signupData.type) {
      toast({
        title: "유형 선택 필요",
        description: "수요기관 또는 공급기업을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!signupData.name.trim()) {
      toast({
        title: "이름 입력 필요",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      console.log('Starting signup process for:', signupData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: signupData.name,
            company: signupData.company || '',
            phone: signupData.phone || '',
            type: signupData.type
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "회원가입 실패",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        toast({
          title: "회원가입 성공",
          description: "이메일을 확인해주세요.",
        });
      }
    } catch (error) {
      console.error('Signup catch error:', error);
      toast({
        title: "오류 발생",
        description: "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">이메일 *</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">비밀번호 *</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={signupData.password}
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">비밀번호 확인 *</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={signupData.confirmPassword}
          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">이름 *</Label>
        <Input
          id="name"
          type="text"
          placeholder="이름을 입력하세요"
          value={signupData.name}
          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-3">
        <Label>유형 * (필수 선택)</Label>
        <RadioGroup
          value={signupData.type}
          onValueChange={(value) => setSignupData({ ...signupData, type: value })}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
            <RadioGroupItem value="공급기업" id="supplier" />
            <Label htmlFor="supplier" className="cursor-pointer">
              <div className="font-medium">공급기업</div>
              <div className="text-sm text-gray-500">기술/서비스 제공</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
            <RadioGroupItem value="수요기관" id="demand" />
            <Label htmlFor="demand" className="cursor-pointer">
              <div className="font-medium">수요기관</div>
              <div className="text-sm text-gray-500">기술/서비스 필요</div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">기업명/기관명</Label>
        <Input
          id="company"
          type="text"
          placeholder="기업명 또는 기관명을 입력하세요"
          value={signupData.company}
          onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">연락처</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="연락처를 입력하세요"
          value={signupData.phone}
          onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "회원가입 중..." : "회원가입"}
      </Button>
    </form>
  );
};

export default SignupForm;
