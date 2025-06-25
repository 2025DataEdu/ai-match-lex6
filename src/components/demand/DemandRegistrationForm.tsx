
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface DemandFormData {
  organization: string;
  department: string;
  username: string;
  type: string;
  demandContent: string;
  budget: string;
  startDate: string;
  endDate: string;
  additionalRequirements: string;
}

interface DemandRegistrationFormProps {
  formData: DemandFormData;
  setFormData: (data: DemandFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const DemandRegistrationForm = ({ formData, setFormData, onSubmit, isLoading }: DemandRegistrationFormProps) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="수요 유형을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AI개발">AI개발</SelectItem>
              <SelectItem value="컨설팅">컨설팅</SelectItem>
              <SelectItem value="교육/강의">교육/강의</SelectItem>
              <SelectItem value="솔루션도입">솔루션도입</SelectItem>
              <SelectItem value="용역">용역</SelectItem>
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
  );
};

export default DemandRegistrationForm;
