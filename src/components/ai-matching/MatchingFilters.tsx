
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Filter, Search, Users, Building2 } from "lucide-react";

interface MatchingFiltersProps {
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  scoreRange: [number, number];
  onScoreRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  matchingPerspective: 'demand' | 'supplier';
  onMatchingPerspectiveChange: (perspective: 'demand' | 'supplier') => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  industries: string[];
}

const MatchingFilters = ({
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
  searchTerm,
  onSearchTermChange,
  onClearFilters,
  hasActiveFilters,
  industries
}: MatchingFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" />
          AI 매칭 필터 및 정렬
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              필터 적용됨
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* 매칭 관점 선택 */}
          <div className="space-y-2">
            <Label>매칭 관점</Label>
            <Select value={matchingPerspective} onValueChange={onMatchingPerspectiveChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demand">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    수요기관별 보기
                  </div>
                </SelectItem>
                <SelectItem value="supplier">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    공급기업별 보기
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 검색 */}
          <div className="space-y-2">
            <Label>검색</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder={matchingPerspective === 'demand' ? "수요기관 검색..." : "공급기업 검색..."}
                className="pl-10"
              />
            </div>
          </div>

          {/* 업종 필터 */}
          <div className="space-y-2">
            <Label>업종</Label>
            <Select value={selectedIndustry} onValueChange={onIndustryChange}>
              <SelectTrigger>
                <SelectValue placeholder="모든 업종" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 업종</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 기준 */}
          <div className="space-y-2">
            <Label>정렬 기준</Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">매칭 점수</SelectItem>
                <SelectItem value="company">기업명</SelectItem>
                <SelectItem value="date">등록일</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 순서 */}
          <div className="space-y-2">
            <Label>정렬 순서</Label>
            <Select value={sortOrder} onValueChange={onSortOrderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">내림차순</SelectItem>
                <SelectItem value="asc">오름차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 초기화 버튼 */}
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              필터 초기화
            </Button>
          </div>
        </div>

        {/* 점수 범위 슬라이더 */}
        <div className="space-y-3">
          <Label>매칭 점수 범위: {scoreRange[0]}% - {scoreRange[1]}%</Label>
          <Slider
            value={scoreRange}
            onValueChange={onScoreRangeChange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingFilters;
