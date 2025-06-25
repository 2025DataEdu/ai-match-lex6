
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

const SupplierRegistration = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: "",
    type: "",
    industry: "",
    patents: "",
    website: "",
    youtubeLink: "",
    username: "",
    description: ""
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('공급기업')
        .insert({
          '공급기업일련번호(PK)': crypto.randomUUID(),
          '아이디(FK)': session.user.id,
          기업명: formData.companyName,
          유형: formData.type,
          업종: formData.industry,
          보유특허: formData.patents,
          기업홈페이지: formData.website,
          유튜브링크: formData.youtubeLink,
          사용자명: formData.username,
          세부설명: formData.description,
          등록일자: new Date().toISOString().split('T')[0],
          관심여부: 'N',
          문의여부: 'N'
        });

      if (error) {
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
      toast({
        title: "오류 발생",
        description: "등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">공급기업 등록</CardTitle>
            <CardDescription>
              기술 서비스를 제공하는 기업 정보를 등록해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">기업명 *</Label>
                  <Input
                    id="companyName"
                    placeholder="기업명을 입력하세요"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">담당자명 *</Label>
                  <Input
                    id="username"
                    placeholder="담당자명을 입력하세요"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">서비스 유형 *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="서비스 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI개발">AI개발</SelectItem>
                      <SelectItem value="컨설팅">컨설팅</SelectItem>
                      <SelectItem value="교육/강의">교육/강의</SelectItem>
                      <SelectItem value="솔루션">솔루션</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">업종</Label>
                  <Input
                    id="industry"
                    placeholder="업종을 입력하세요"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patents">보유특허</Label>
                <Textarea
                  id="patents"
                  placeholder="보유하고 있는 특허나 인증을 입력하세요"
                  value={formData.patents}
                  onChange={(e) => setFormData({ ...formData, patents: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">기업 홈페이지</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeLink">유튜브 링크</Label>
                  <Input
                    id="youtubeLink"
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={formData.youtubeLink}
                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">세부설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="제공하는 기술 서비스에 대한 상세한 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "등록 중..." : "등록하기"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierRegistration;
