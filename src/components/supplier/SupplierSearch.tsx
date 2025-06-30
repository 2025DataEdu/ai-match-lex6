
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  onReset: () => void;
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

const SupplierSearch = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedIndustry,
  onIndustryChange,
  onReset
}: SupplierSearchProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="기업명 또는 기술명 검색..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="AI 서비스 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">모든 AI 서비스</SelectItem>
              {AI_SERVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedIndustry} onValueChange={onIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="업종" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">모든 업종</SelectItem>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={onReset}>
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierSearch;
