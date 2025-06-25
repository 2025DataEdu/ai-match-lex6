
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  totalSuppliers: number;
  filteredCount: number;
  isLoading: boolean;
}

export const EmptyState = ({ searchTerm, totalSuppliers, filteredCount, isLoading }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? "검색 결과가 없습니다" : "등록된 공급기업이 없습니다"}
      </h3>
      <p className="text-gray-600 mb-4">
        {searchTerm 
          ? "다른 검색어로 시도해보세요" 
          : `총 ${totalSuppliers}개의 공급기업이 등록되어 있지만 표시할 수 없습니다.`
        }
      </p>
      <div className="space-y-2">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <a href="/supplier-registration">공급기업 등록하기</a>
        </Button>
        <div className="text-sm text-gray-500">
          디버그 정보: 로딩중={isLoading.toString()}, 
          전체공급기업={totalSuppliers}, 
          필터된공급기업={filteredCount}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
