
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

interface Supplier {
  공급기업일련번호: string;
  기업명: string;
  유형: string;
  업종: string;
  세부설명: string;
  기업홈페이지?: string;
  유튜브링크?: string;
  보유특허?: string;
  사용자명?: string;
  등록일자?: string;
}

interface SupplierEditModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const SupplierEditModal = ({ supplier, isOpen, onClose, onUpdate }: SupplierEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    기업명: supplier.기업명 || "",
    유형: supplier.유형 || "",
    업종: supplier.업종 || "",
    세부설명: supplier.세부설명 || "",
    기업홈페이지: supplier.기업홈페이지 || "",
    유튜브링크: supplier.유튜브링크 || "",
    보유특허: supplier.보유특허 || "",
    사용자명: supplier.사용자명 || ""
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('공급기업')
        .update({
          기업명: formData.기업명,
          유형: formData.유형,
          업종: formData.업종,
          세부설명: formData.세부설명,
          기업홈페이지: formData.기업홈페이지 || null,
          유튜브링크: formData.유튜브링크 || null,
          보유특허: formData.보유특허 || null,
          사용자명: formData.사용자명
        })
        .eq('공급기업일련번호', supplier.공급기업일련번호);

      if (error) {
        toast({
          title: "수정 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "수정 완료",
          description: "공급기업 정보가 성공적으로 수정되었습니다.",
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
        .from('공급기업')
        .delete()
        .eq('공급기업일련번호', supplier.공급기업일련번호);

      if (error) {
        toast({
          title: "삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "삭제 완료",
          description: "공급기업이 성공적으로 삭제되었습니다.",
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
          <DialogTitle>공급기업 정보 수정</DialogTitle>
          <DialogDescription>
            공급기업 정보를 수정하거나 삭제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="기업명">기업명 *</Label>
              <Input
                id="기업명"
                value={formData.기업명}
                onChange={(e) => setFormData({ ...formData, 기업명: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="사용자명">담당자명 *</Label>
              <Input
                id="사용자명"
                value={formData.사용자명}
                onChange={(e) => setFormData({ ...formData, 사용자명: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="유형">서비스 유형 *</Label>
              <Select
                value={formData.유형}
                onValueChange={(value) => setFormData({ ...formData, 유형: value })}
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
              <Label htmlFor="업종">업종</Label>
              <Input
                id="업종"
                value={formData.업종}
                onChange={(e) => setFormData({ ...formData, 업종: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="기업홈페이지">기업 홈페이지</Label>
            <Input
              id="기업홈페이지"
              type="url"
              value={formData.기업홈페이지}
              onChange={(e) => setFormData({ ...formData, 기업홈페이지: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="유튜브링크">유튜브 링크</Label>
            <Input
              id="유튜브링크"
              type="url"
              value={formData.유튜브링크}
              onChange={(e) => setFormData({ ...formData, 유튜브링크: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="보유특허">보유특허</Label>
            <Textarea
              id="보유특허"
              value={formData.보유특허}
              onChange={(e) => setFormData({ ...formData, 보유특허: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="세부설명">세부설명 *</Label>
            <Textarea
              id="세부설명"
              value={formData.세부설명}
              onChange={(e) => setFormData({ ...formData, 세부설명: e.target.value })}
              rows={4}
              required
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
                    이 작업은 되돌릴 수 없습니다. 공급기업 정보가 영구적으로 삭제됩니다.
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
