
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, RefreshCw } from "lucide-react";

interface DemandFilterOptions {
  searchTerm: string;
  demandType: string;
  minBudget: string;
  maxBudget: string;
  organization: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface DemandFiltersProps {
  filters: DemandFilterOptions;
  onFiltersChange: (filters: DemandFilterOptions) => void;
  onClearFilters: () => void;
  onRefresh: () => Promise<void>;
}

const DemandFilters = ({ filters, onFiltersChange, onClearFilters, onRefresh }: DemandFiltersProps) => {
  const handleReset = () => {
    onClearFilters();
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="기관명 또는 수요내용 검색..."
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="등록일자">등록일</SelectItem>
              <SelectItem value="수요기관">기관명</SelectItem>
              <SelectItem value="유형">수요 유형</SelectItem>
              <SelectItem value="금액">예산</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.sortOrder} 
            onValueChange={(value: 'asc' | 'desc') => onFiltersChange({ ...filters, sortOrder: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="정렬 순서" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">내림차순</SelectItem>
              <SelectItem value="asc">오름차순</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              초기화
            </Button>
            <Button variant="outline" onClick={onRefresh} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandFilters;
