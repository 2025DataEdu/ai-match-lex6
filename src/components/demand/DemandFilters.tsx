
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FilterOptions {
  selectedType: string;
  selectedIndustry: string;
  scoreRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface DemandFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  onRefresh: () => Promise<void>;
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

const DemandFilters = ({ filters, onFiltersChange, onClearFilters, onRefresh }: DemandFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">AI 서비스 유형</label>
            <Select 
              value={filters.selectedType} 
              onValueChange={(value) => onFiltersChange({ ...filters, selectedType: value })}
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
          <Button variant="outline" onClick={onClearFilters}>
            초기화
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            새로고침
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandFilters;
