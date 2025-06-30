
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";

interface FormData {
  companyName: string;
  type: string;
  industry: string;
  patents: string;
  website: string;
  youtubeLinks: string[];
  username: string;
  description: string;
}

interface SupplierRegistrationFormProps {
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const AI_SERVICE_TYPES = [
  "AI 챗봇/대화형AI",
  "컴퓨터 비전/이미지AI", 
  "자연어처리/텍스트AI",
  "음성인식/음성AI",
  "예측분석/데이터AI",
  "추천시스템/개인화AI",
  "로봇/자동화AI",
  "AI 플랫폼/인프라",
  "AI 교육/컨설팅",
  "기타 AI 서비스"
];

const INDUSTRIES = [
  "제조업",
  "정보통신업",
  "금융업",
  "유통업",
  "의료업",
  "교육업",
  "건설업",
  "운송업",
  "농업",
  "서비스업",
  "연구개발업",
  "컨설팅업",
  "기타"
];

const SupplierRegistrationForm = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  isLoading, 
  onCancel 
}: SupplierRegistrationFormProps) => {
  const addYoutubeLink = () => {
    if (formData.youtubeLinks.length < 3) {
      onFormDataChange({
        ...formData,
        youtubeLinks: [...formData.youtubeLinks, ""]
      });
    }
  };

  const removeYoutubeLink = (index: number) => {
    if (formData.youtubeLinks.length > 1) {
      const newLinks = formData.youtubeLinks.filter((_, i) => i !== index);
      onFormDataChange({
        ...formData,
        youtubeLinks: newLinks
      });
    }
  };

  const updateYoutubeLink = (index: number, value: string) => {
    const newLinks = [...formData.youtubeLinks];
    newLinks[index] = value;
    onFormDataChange({
      ...formData,
      youtubeLinks: newLinks
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">기업명 *</Label>
          <Input
            id="companyName"
            placeholder="기업명을 입력하세요"
            value={formData.companyName}
            onChange={(e) => onFormDataChange({ ...formData, companyName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">담당자명 *</Label>
          <Input
            id="username"
            placeholder="담당자명을 입력하세요"
            value={formData.username}
            onChange={(e) => onFormDataChange({ ...formData, username: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">AI 서비스 유형 *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => onFormDataChange({ ...formData, type: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="AI 서비스 유형을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {AI_SERVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">업종 *</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => onFormDataChange({ ...formData, industry: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="업종을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
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
          onChange={(e) => onFormDataChange({ ...formData, patents: e.target.value })}
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
          onChange={(e) => onFormDataChange({ ...formData, website: e.target.value })}
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
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          rows={5}
          required
        />
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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

export default SupplierRegistrationForm;
export type { FormData };
