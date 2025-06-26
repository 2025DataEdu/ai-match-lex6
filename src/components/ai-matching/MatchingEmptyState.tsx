
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface MatchingEmptyStateProps {
  type: 'no-matches' | 'no-filtered-results';
  onClearFilters?: () => void;
}

const MatchingEmptyState = ({ type, onClearFilters }: MatchingEmptyStateProps) => {
  if (type === 'no-matches') {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          개선된 AI 매칭을 시작해보세요
        </h3>
        <p className="text-gray-600">
          키워드 유사도와 기업 역량을 종합 분석하여 최적의 매칭을 찾아드립니다
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        필터 조건에 맞는 결과가 없습니다
      </h3>
      <p className="text-gray-600 mb-4">
        다른 필터 조건을 시도해보거나 필터를 초기화해보세요
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        필터 초기화
      </Button>
    </div>
  );
};

export default MatchingEmptyState;
