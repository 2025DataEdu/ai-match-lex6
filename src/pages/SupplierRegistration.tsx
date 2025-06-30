
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
import { Plus, Minus } from "lucide-react";

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
    youtubeLinks: [""],
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

  const addYoutubeLink = () => {
    if (formData.youtubeLinks.length < 3) {
      setFormData({
        ...formData,
        youtubeLinks: [...formData.youtubeLinks, ""]
      });
    }
  };

  const removeYoutubeLink = (index: number) => {
    if (formData.youtubeLinks.length > 1) {
      const newLinks = formData.youtubeLinks.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        youtubeLinks: newLinks
      });
    }
  };

  const updateYoutubeLink = (index: number, value: string) => {
    const newLinks = [...formData.youtubeLinks];
    newLinks[index] = value;
    setFormData({
      ...formData,
      youtubeLinks: newLinks
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="서비스 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI개발">AI개발</SelectItem>
                      <SelectItem value="컨설팅">컨설팅</SelectItem>
                      <SelectItem value="교육/강의">교육/강의</SelectItem>
                      <SelectItem value="솔루션">솔루션</SelectItem>
                      <SelectItem value="용역">용역</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">업종 *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="업종을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="제조업">제조업</SelectItem>
                      <SelectItem value="정보통신업">정보통신업</SelectItem>
                      <SelectItem value="금융업">금융업</SelectItem>
                      <SelectItem value="유통업">유통업</SelectItem>
                      <SelectItem value="의료업">의료업</SelectItem>
                      <SelectItem value="교육업">교육업</SelectItem>
                      <SelectItem value="건설업">건설업</SelectItem>
                      <SelectItem value="운송업">운송업</SelectItem>
                      <SelectItem value="농업">농업</SelectItem>
                      <SelectItem value="서비스업">서비스업</SelectItem>
                      <SelectItem value="연구개발업">연구개발업</SelectItem>
                      <SelectItem value="컨설팅업">컨설팅업</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="flex items-center justify-between">
                  <Label>유튜브 링크 (최대 3개)</Label>
                  {formData.youtubeLinks.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addYoutubeLink}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {formData.youtubeLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={link}
                        onChange={(e) => updateYoutubeLink(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.youtubeLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeYoutubeLink(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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
