
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCcw, ArrowUp, ArrowDown } from "lucide-react";

interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onRefresh: () => void;
}

const SupplierSearch = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onRefresh 
}: SupplierSearchProps) => {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex gap-4 items-center flex-wrap">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="기업명, 업종, 기술 설명으로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="등록일자">등록일자</SelectItem>
            <SelectItem value="기업명">기업명</SelectItem>
            <SelectItem value="유형">유형</SelectItem>
            <SelectItem value="업종">업종</SelectItem>
            <SelectItem value="특허유무">특허유무</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="flex items-center gap-1"
        >
          {sortOrder === 'asc' ? (
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
    </div>
  );
};

export default SupplierSearch;
