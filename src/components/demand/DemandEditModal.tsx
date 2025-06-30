
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface Demand {
  수요기관일련번호: string;
  수요기관: string;
  부서명: string;
  사용자명: string;
  유형: string;
  수요내용: string;
  금액: number;
  시작일: string;
  종료일: string;
  기타요구사항: string;
  등록일자: string;
}

interface DemandEditModalProps {
  demand: Demand;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const DemandEditModal = ({ demand, isOpen, onClose, onUpdate }: DemandEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    수요기관: demand.수요기관 || "",
    부서명: demand.부서명 || "",
    사용자명: demand.사용자명 || "",
    유형: demand.유형 || "",
    수요내용: demand.수요내용 || "",
    금액: demand.금액?.toString() || "",
    시작일: demand.시작일 || "",
    종료일: demand.종료일 || "",
    기타요구사항: demand.기타요구사항 || ""
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('수요기관')
        .update({
          수요기관: formData.수요기관,
          부서명: formData.부서명 || null,
          사용자명: formData.사용자명,
          유형: formData.유형,
          수요내용: formData.수요내용,
          금액: formData.금액 ? parseInt(formData.금액) : null,
          시작일: formData.시작일 || null,
          종료일: formData.종료일 || null,
          기타요구사항: formData.기타요구사항 || null
        })
        .eq('수요기관일련번호', demand.수요기관일련번호);

      if (error) {
        toast({
          title: "수정 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "수정 완료",
          description: "수요기관 정보가 성공적으로 수정되었습니다.",
        });
        onUpdate();
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "오류 발생",
        description: "수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('수요기관')
        .delete()
        .eq('수요기관일련번호', demand.수요기관일련번호);

      if (error) {
        toast({
          title: "삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "삭제 완료",
          description: "수요기관이 성공적으로 삭제되었습니다.",
        });
        onUpdate();
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "오류 발생",
        description: "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>수요기관 정보 수정</DialogTitle>
          <DialogDescription>
            수요기관 정보를 수정하거나 삭제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="수요기관">수요기관명 *</Label>
              <Input
                id="수요기관"
                value={formData.수요기관}
                onChange={(e) => setFormData({ ...formData, 수요기관: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="부서명">부서명</Label>
              <Input
                id="부서명"
                value={formData.부서명}
                onChange={(e) => setFormData({ ...formData, 부서명: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="사용자명">담당자명 *</Label>
              <Input
                id="사용자명"
                value={formData.사용자명}
                onChange={(e) => setFormData({ ...formData, 사용자명: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="유형">수요 유형 *</Label>
              <Select
                value={formData.유형}
                onValueChange={(value) => setFormData({ ...formData, 유형: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="수요 유형을 선택하세요" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="수요내용">수요내용 *</Label>
            <Textarea
              id="수요내용"
              value={formData.수요내용}
              onChange={(e) => setFormData({ ...formData, 수요내용: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="금액">예산 금액</Label>
              <Input
                id="금액"
                type="number"
                value={formData.금액}
                onChange={(e) => setFormData({ ...formData, 금액: e.target.value })}
                placeholder="원"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="시작일">시작일</Label>
              <Input
                id="시작일"
                type="date"
                value={formData.시작일}
                onChange={(e) => setFormData({ ...formData, 시작일: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="종료일">종료일</Label>
              <Input
                id="종료일"
                type="date"
                value={formData.종료일}
                onChange={(e) => setFormData({ ...formData, 종료일: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="기타요구사항">기타 요구사항</Label>
            <Textarea
              id="기타요구사항"
              value={formData.기타요구사항}
              onChange={(e) => setFormData({ ...formData, 기타요구사항: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 수요기관 정보가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "삭제 중..." : "삭제"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "수정 중..." : "수정 완료"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
