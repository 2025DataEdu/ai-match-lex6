
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DemandEmptyStateProps {
  hasFilters: boolean;
}

const DemandEmptyState = ({ hasFilters }: DemandEmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasFilters ? "검색 조건에 맞는 수요내용이 없습니다" : "등록된 수요내용이 없습니다"}
      </h3>
      <p className="text-gray-600 mb-4">
        {hasFilters ? "다른 검색 조건으로 시도해보세요" : "첫 번째 수요를 등록해보세요"}
      </p>
      <Button 
        onClick={() => navigate('/demand-registration')}
        className="bg-green-600 hover:bg-green-700"
      >
        수요기관 등록하기
      </Button>
    </div>
  );
};

export default DemandEmptyState;
