
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import EnhancedMatchingCard from "./EnhancedMatchingCard";
import { DetailedMatch } from "@/utils/matchingAlgorithm";
import { Building2, Users } from "lucide-react";
import { useInterest } from "@/hooks/useInterest";
import { useEffect } from "react";

interface MatchingResultsProps {
  matches: DetailedMatch[];
  onInterestClick: (match: DetailedMatch) => void;
  onInquiryClick: (match: DetailedMatch) => void;
  perspective: 'demand' | 'supplier';
}

const MatchingResults = ({ matches, onInterestClick, onInquiryClick, perspective }: MatchingResultsProps) => {
  const { fetchInterestStats, toggleInterest, getInterestData } = useInterest();

  // 매칭 결과가 변경될 때 관심 통계 조회
  useEffect(() => {
    if (matches.length > 0) {
      const matchPairs = matches.map(match => ({
        공급기업일련번호: match.supplier.공급기업일련번호,
        수요기관일련번호: match.demand.수요기관일련번호
      }));
      fetchInterestStats(matchPairs);
    }
  }, [matches, fetchInterestStats]);

  // 그룹별로 매칭 결과 구성
  const groupedResults = matches.reduce((acc, match, index) => {
    const groupKey = perspective === 'demand' 
      ? match.demand.수요기관일련번호 
      : match.supplier.공급기업일련번호;
    
    if (!acc[groupKey]) {
      acc[groupKey] = {
        entity: perspective === 'demand' ? match.demand : match.supplier,
        matches: [],
        startIndex: index
      };
    }
    
    acc[groupKey].matches.push({ match, originalIndex: index });
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {perspective === 'demand' ? <Users className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          {perspective === 'demand' ? '수요기관별' : '공급기업별'} 매칭 결과 ({matches.length}개)
        </h2>
        <Badge variant="outline" className="text-sm">
          {perspective === 'demand' ? 
            `${Object.keys(groupedResults).length}개 수요기관` : 
            `${Object.keys(groupedResults).length}개 공급기업`
          }
        </Badge>
      </div>
      
      <ScrollArea className="h-[800px] w-full">
        <div className="space-y-8 pr-4">
          {Object.values(groupedResults).map((group: any, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              {/* 그룹 헤더 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {perspective === 'demand' ? <Users className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  {perspective === 'demand' ? 
                    group.entity.수요기관 : 
                    group.entity.기업명
                  }
                  <Badge variant="secondary" className="ml-2">
                    {group.matches.length}개 매칭
                  </Badge>
                </h3>
                {perspective === 'demand' && group.entity.수요내용 && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {group.entity.수요내용.slice(0, 100)}...
                  </p>
                )}
                {perspective === 'supplier' && group.entity.세부설명 && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {group.entity.세부설명.slice(0, 100)}...
                  </p>
                )}
              </div>
              
              {/* 그룹 내 매칭 카드들 */}
              <div className="grid gap-4 ml-4">
                {group.matches.map(({ match, originalIndex }: any) => (
                  <EnhancedMatchingCard
                    key={`${match.supplier.공급기업일련번호}-${match.demand.수요기관일련번호}`}
                    match={match}
                    index={originalIndex}
                    onInterestClick={onInterestClick}
                    onInquiryClick={onInquiryClick}
                    showGroupContext={false}
                    interestData={getInterestData(match.supplier.공급기업일련번호, match.demand.수요기관일련번호)}
                    onToggleInterest={toggleInterest}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MatchingResults;
