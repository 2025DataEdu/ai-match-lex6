
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MatchingFiltersProps {
  filters: {
    minScore: number;
    maxScore: number;
    serviceType: string;
    industry: string;
    keyword: string;
  };
  onFiltersChange: (filters: any) => void;
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

const MatchingFilters = ({ filters, onFiltersChange, onReset }: MatchingFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">AI 매칭 필터</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>최소 매칭 점수</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={filters.minScore}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                minScore: parseInt(e.target.value) || 0 
              })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label>최대 매칭 점수</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={filters.maxScore}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                maxScore: parseInt(e.target.value) || 100 
              })}
              placeholder="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label>AI 서비스 유형</Label>
            <Select
              value={filters.serviceType}
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                serviceType: value 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="모든 AI 서비스" />
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
          </div>
          
          <div className="space-y-2">
            <Label>업종</Label>
            <Select
              value={filters.industry}
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                industry: value 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="모든 업종" />
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
          </div>
          
          <div className="space-y-2">
            <Label>키워드 검색</Label>
            <Input
              type="text"
              value={filters.keyword}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                keyword: e.target.value 
              })}
              placeholder="키워드 입력"
            />
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={onReset} className="w-full">
              필터 초기화
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingFilters;
