
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface FilterOptions {
  searchTerm: string;
  demandType: string;
  minBudget: string;
  maxBudget: string;
  organization: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface DemandFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const DemandFilters = ({ filters, onFiltersChange, onClearFilters }: DemandFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSortOrder = () => {
    updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const hasActiveFilters = filters.demandType || filters.minBudget || filters.maxBudget || filters.organization;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="수요 내용, 기관명, 담당자명으로 검색..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="등록일자">등록일자</SelectItem>
              <SelectItem value="수요기관">기관명</SelectItem>
              <SelectItem value="금액">예산</SelectItem>
              <SelectItem value="유형">유형</SelectItem>
              <SelectItem value="시작일">시작일</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="flex items-center gap-1"
          >
            {filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          상세 필터
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            초기화
          </Button>
        )}
      </div>

      {showAdvanced && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">기관명</label>
                <Input
                  placeholder="기관명 입력"
                  value={filters.organization}
                  onChange={(e) => updateFilter('organization', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">수요 유형</label>
                <Select
                  value={filters.demandType}
                  onValueChange={(value) => updateFilter('demandType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">전체</SelectItem>
                    <SelectItem value="AI개발">AI개발</SelectItem>
                    <SelectItem value="컨설팅">컨설팅</SelectItem>
                    <SelectItem value="교육/강의">교육/강의</SelectItem>
                    <SelectItem value="솔루션도입">솔루션도입</SelectItem>
                    <SelectItem value="용역">용역</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">최소 예산 (만원)</label>
                <Input
                  type="number"
                  placeholder="최소 금액"
                  value={filters.minBudget}
                  onChange={(e) => updateFilter('minBudget', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">최대 예산 (만원)</label>
                <Input
                  type="number"
                  placeholder="최대 금액"
                  value={filters.maxBudget}
                  onChange={(e) => updateFilter('maxBudget', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemandFilters;
