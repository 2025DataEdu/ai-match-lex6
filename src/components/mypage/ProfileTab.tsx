
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface UserProfile {
  아이디: string;
  이메일: string;
  이름: string;
  연락처: string;
  기업명: string;
  부서명: string;
  유형: string;
}

export const ProfileTab = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user?.email) return;

      const userId = session.session.user.email.split('@')[0];

      const { data, error } = await supabase
        .from('회원관리')
        .select('*')
        .eq('아이디', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "프로필 로드 실패",
          description: "프로필 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('회원관리')
        .update({
          이름: profile.이름,
          연락처: profile.연락처,
          기업명: profile.기업명,
          부서명: profile.부서명,
        })
        .eq('아이디', profile.아이디);

      if (error) {
        toast({
          title: "업데이트 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "업데이트 완료",
          description: "프로필이 성공적으로 업데이트되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "비밀번호 변경 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "비밀번호 변경 완료",
          description: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">프로필 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 기본 정보 수정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                value={profile.이메일}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
            </div>
            
            <div>
              <Label htmlFor="userId">아이디</Label>
              <Input
                id="userId"
                value={profile.아이디}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={profile.이름 || ""}
                onChange={(e) => setProfile({ ...profile, 이름: e.target.value })}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                value={profile.연락처 || ""}
                onChange={(e) => setProfile({ ...profile, 연락처: e.target.value })}
                placeholder="연락처를 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="company">기업명</Label>
              <Input
                id="company"
                value={profile.기업명 || ""}
                onChange={(e) => setProfile({ ...profile, 기업명: e.target.value })}
                placeholder="기업명을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="department">부서명</Label>
              <Input
                id="department"
                value={profile.부서명 || ""}
                onChange={(e) => setProfile({ ...profile, 부서명: e.target.value })}
                placeholder="부서명을 입력하세요"
              />
            </div>
          </div>

          <Button 
            onClick={handleProfileUpdate} 
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            {isSaving ? "저장 중..." : "프로필 업데이트"}
          </Button>
        </CardContent>
      </Card>

      {/* 비밀번호 변경 */}
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>

          <Button 
            onClick={handlePasswordChange} 
            disabled={isChangingPassword || !newPassword || !confirmPassword}
            variant="outline"
            className="w-full md:w-auto"
          >
            {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
