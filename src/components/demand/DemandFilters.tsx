
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";

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
  onRefresh?: () => void;
}

const DemandFilters = ({ filters, onFiltersChange, onClearFilters, onRefresh }: DemandFiltersProps) => {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSortOrder = () => {
    updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const hasActiveFilters = filters.searchTerm || filters.demandType || filters.minBudget || filters.maxBudget || filters.organization;

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
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          새로고침
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
    </div>
  );
};

export default DemandFilters;
