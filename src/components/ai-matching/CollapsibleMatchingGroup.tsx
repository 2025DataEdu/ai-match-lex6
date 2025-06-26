
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, ChevronDown, ChevronUp } from "lucide-react";
import { DetailedMatch } from "@/utils/matchingAlgorithm";
import EnhancedMatchingCard from "./EnhancedMatchingCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleMatchingGroupProps {
  entity: any;
  matches: { match: DetailedMatch; originalIndex: number }[];
  perspective: 'demand' | 'supplier';
  onInterestClick: (match: DetailedMatch) => void;
  onInquiryClick: (match: DetailedMatch) => void;
  getInterestData: (공급기업일련번호: string, 수요기관일련번호: string) => any;
  onToggleInterest: (공급기업일련번호: string, 수요기관일련번호: string) => void;
}

const CollapsibleMatchingGroup = ({
  entity,
  matches,
  perspective,
  onInterestClick,
  onInquiryClick,
  getInterestData,
  onToggleInterest
}: CollapsibleMatchingGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const averageScore = Math.round(
    matches.reduce((sum, { match }) => sum + match.matchScore, 0) / matches.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {perspective === 'demand' ? <Users className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                {perspective === 'demand' ? entity.수요기관 : entity.기업명}
                <Badge variant="secondary" className="ml-2">
                  {matches.length}개 매칭
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getScoreColor(averageScore)}`}></div>
                  <span className="text-sm text-gray-600">평균 {averageScore}%</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            
            {/* 간략 정보 */}
            <div className="text-sm text-gray-600 mt-2">
              {perspective === 'demand' && entity.수요내용 && (
                <p className="line-clamp-1">
                  {entity.수요내용.slice(0, 80)}...
                </p>
              )}
              {perspective === 'supplier' && entity.세부설명 && (
                <p className="line-clamp-1">
                  {entity.세부설명.slice(0, 80)}...
                </p>
              )}
              
              {/* 매칭 미리보기 - 관점에 따라 상대방 정보 표시 */}
              <div className="flex flex-wrap gap-1 mt-2">
                {matches.slice(0, 3).map(({ match }, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {perspective === 'demand' ? match.supplier.기업명 : match.demand.수요기관}
                  </Badge>
                ))}
                {matches.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{matches.length - 3}개 더
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {matches.map(({ match, originalIndex }) => (
                <EnhancedMatchingCard
                  key={`${match.supplier.공급기업일련번호}-${match.demand.수요기관일련번호}`}
                  match={match}
                  index={originalIndex}
                  onInterestClick={onInterestClick}
                  onInquiryClick={onInquiryClick}
                  showGroupContext={false}
                  perspective={perspective}
                  interestData={getInterestData(match.supplier.공급기업일련번호, match.demand.수요기관일련번호)}
                  onToggleInterest={onToggleInterest}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CollapsibleMatchingGroup;
