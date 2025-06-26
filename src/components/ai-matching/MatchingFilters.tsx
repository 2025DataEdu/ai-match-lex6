
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X, ArrowUpDown } from "lucide-react";

interface MatchingFiltersProps {
  industries: string[];
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  scoreRange: [number, number];
  onScoreRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  matchingPerspective: 'demand' | 'supplier';
  onMatchingPerspectiveChange: (perspective: 'demand' | 'supplier') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const MatchingFilters = ({
  industries,
  selectedIndustry,
  onIndustryChange,
  scoreRange,
  onScoreRangeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  matchingPerspective,
  onMatchingPerspectiveChange,
  onClearFilters,
  hasActiveFilters
}: MatchingFiltersProps) => {
  const scoreRanges = [
    { label: "전체", value: [0, 100] as [number, number] },
    { label: "80% 이상 (높음)", value: [80, 100] as [number, number] },
    { label: "60-79% (보통)", value: [60, 79] as [number, number] },
    { label: "60% 미만 (낮음)", value: [0, 59] as [number, number] }
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" />
          필터 및 정렬
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              초기화
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 매칭 관점 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">매칭 관점</label>
            <Select value={matchingPerspective} onValueChange={onMatchingPerspectiveChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demand">수요기관 중심</SelectItem>
                <SelectItem value="supplier">공급기업 중심</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 업종별 필터 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">업종</label>
            <Select value={selectedIndustry} onValueChange={onIndustryChange}>
              <SelectTrigger>
                <SelectValue placeholder="전체 업종" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 업종</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 점수 구간별 필터 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">매칭 점수</label>
            <Select 
              value={`${scoreRange[0]}-${scoreRange[1]}`} 
              onValueChange={(value) => {
                const range = scoreRanges.find(r => `${r.value[0]}-${r.value[1]}` === value);
                if (range) onScoreRangeChange(range.value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scoreRanges.map((range) => (
                  <SelectItem key={`${range.value[0]}-${range.value[1]}`} value={`${range.value[0]}-${range.value[1]}`}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 기준 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">정렬 기준</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">매칭점수</SelectItem>
                <SelectItem value="등록일자">등록일</SelectItem>
                <SelectItem value="기업명">기업명</SelectItem>
                <SelectItem value="capabilityScore">기업역량</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 순서 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">정렬 순서</label>
            <Button
              variant="outline"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full justify-start"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortOrder === 'asc' ? '오름차순' : '내림차순'}
            </Button>
          </div>
        </div>

        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              관점: {matchingPerspective === 'demand' ? '수요기관 중심' : '공급기업 중심'}
            </Badge>
            {selectedIndustry !== "all" && (
              <Badge variant="secondary">업종: {selectedIndustry}</Badge>
            )}
            {(scoreRange[0] !== 0 || scoreRange[1] !== 100) && (
              <Badge variant="secondary">
                점수: {scoreRange[0]}%-{scoreRange[1]}%
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchingFilters;
