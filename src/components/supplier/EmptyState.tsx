
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
          ? `"${searchTerm}"에 대한 검색 결과가 없습니다. 다른 검색어로 시도해보세요.` 
          : "아직 등록된 공급기업이 없습니다. 첫 번째 공급기업을 등록해보세요!"
        }
      </p>
      <div className="space-y-4">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <a href="/supplier-registration">공급기업 등록하기</a>
        </Button>
        {!searchTerm && (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>참고:</strong> 공급기업 데이터가 표시되지 않는 경우:
            <ul className="mt-2 text-left list-disc list-inside space-y-1">
              <li>데이터베이스에 공급기업 데이터가 있는지 확인</li>
              <li>Row Level Security 정책이 올바르게 설정됐는지 확인</li>
              <li>네트워크 연결 상태 확인</li>
            </ul>
          </div>
        )}
        <div className="text-xs text-gray-400">
          디버그 정보: 로딩중={isLoading.toString()}, 
          전체공급기업={totalSuppliers}, 
          필터된공급기업={filteredCount}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
