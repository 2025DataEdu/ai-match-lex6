
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

const DemandRegistration = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    organization: "",
    department: "",
    username: "",
    type: "",
    demandContent: "",
    budget: "",
    startDate: "",
    endDate: "",
    additionalRequirements: ""
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
        .from('수요기관')
        .insert({
          '수요기관일련번호(PK)': crypto.randomUUID(),
          '아이디(FK)': session.user.id,
          수요기관: formData.organization,
          부서명: formData.department,
          사용자명: formData.username,
          유형: formData.type,
          수요내용: formData.demandContent,
          금액: formData.budget ? parseInt(formData.budget) : null,
          시작일: formData.startDate,
          종료일: formData.endDate,
          기타요구사항: formData.additionalRequirements,
          등록일자: new Date().toISOString().split('T')[0],
          관심여부: 'N'
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
          description: "수요기관이 성공적으로 등록되었습니다.",
        });
        navigate("/demands");
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
            <CardTitle className="text-2xl font-bold">수요기관 등록</CardTitle>
            <CardDescription>
              기술 서비스가 필요한 기관의 수요 정보를 등록해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organization">기관명 *</Label>
                  <Input
                    id="organization"
                    placeholder="기관명을 입력하세요"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서명</Label>
                  <Input
                    id="department"
                    placeholder="부서명을 입력하세요"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                <div className="space-y-2">
                  <Label htmlFor="type">수요 유형 *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="수요 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI개발">AI개발</SelectItem>
                      <SelectItem value="컨설팅">컨설팅</SelectItem>
                      <SelectItem value="교육/강의">교육/강의</SelectItem>
                      <SelectItem value="솔루션도입">솔루션도입</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demandContent">수요내용 *</Label>
                <Textarea
                  id="demandContent"
                  placeholder="필요한 기술 서비스에 대한 상세한 설명을 입력하세요"
                  value={formData.demandContent}
                  onChange={(e) => setFormData({ ...formData, demandContent: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">예산 (만원)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="예산을 입력하세요 (만원 단위)"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">시작일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">종료일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalRequirements">기타 요구사항</Label>
                <Textarea
                  id="additionalRequirements"
                  placeholder="추가적인 요구사항이나 특이사항을 입력하세요"
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  rows={3}
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

export default DemandRegistration;
