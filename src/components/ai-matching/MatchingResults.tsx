
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import CollapsibleMatchingGroup from "./CollapsibleMatchingGroup";
import { DetailedMatch } from "@/types/matching";
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
        <div className="space-y-4 pr-4">
          {Object.values(groupedResults).map((group: any, groupIndex) => (
            <CollapsibleMatchingGroup
              key={groupIndex}
              entity={group.entity}
              matches={group.matches}
              perspective={perspective}
              onInterestClick={onInterestClick}
              onInquiryClick={onInquiryClick}
              getInterestData={getInterestData}
              onToggleInterest={toggleInterest}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MatchingResults;
