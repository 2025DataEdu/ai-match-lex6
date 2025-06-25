
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export const SupplierSearch = ({ searchTerm, onSearchChange, onRefresh }: SupplierSearchProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="기업명, 업종, 기술 분야로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button onClick={onRefresh} variant="outline">
        새로고침
      </Button>
    </div>
  );
};

export default SupplierSearch;
