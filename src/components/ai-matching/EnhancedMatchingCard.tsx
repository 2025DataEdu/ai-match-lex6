
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedMatch } from "@/types/matching";
import { useInquiryComments } from "@/hooks/useInquiryComments";
import { useState, useEffect } from "react";
import MatchingCardHeader from "./card/MatchingCardHeader";
import MatchingCardDescription from "./card/MatchingCardDescription";
import MatchingScoreDisplay from "./card/MatchingScoreDisplay";
import MatchingKeywordSection from "./card/MatchingKeywordSection";
import MatchingDescriptionSection from "./card/MatchingDescriptionSection";
import MatchingFeatureIcons from "./card/MatchingFeatureIcons";
import MatchingContextSection from "./card/MatchingContextSection";
import MatchingActionButtons from "./card/MatchingActionButtons";

interface EnhancedMatchingCardProps {
  match: DetailedMatch;
  index: number;
  onInterestClick: (match: DetailedMatch) => void;
  onInquiryClick: (match: DetailedMatch) => void;
  showGroupContext?: boolean;
  perspective?: 'demand' | 'supplier';
  interestData?: {
    관심수: number;
    사용자관심여부: boolean;
  };
  onToggleInterest: (공급기업일련번호: string, 수요기관일련번호: string) => void;
}

const EnhancedMatchingCard = ({ 
  match, 
  index, 
  onInterestClick, 
  onInquiryClick,
  showGroupContext = true,
  perspective = 'demand',
  interestData,
  onToggleInterest
}: EnhancedMatchingCardProps) => {
  const [commentCount, setCommentCount] = useState(0);
  const { getCommentCount } = useInquiryComments();

  const matchingId = `${match.supplier.공급기업일련번호}_${match.demand.수요기관일련번호}`;

  useEffect(() => {
    const fetchCommentCount = async () => {
      const count = await getCommentCount(matchingId);
      setCommentCount(count);
    };
    fetchCommentCount();
  }, [matchingId, getCommentCount]);

  const handleInterestClick = () => {
    onToggleInterest(match.supplier.공급기업일련번호, match.demand.수요기관일련번호);
  };

  const handleCommentAdded = async () => {
    const count = await getCommentCount(matchingId);
    setCommentCount(count);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle>
          <MatchingCardHeader 
            match={match} 
            perspective={perspective} 
            matchScore={match.matchScore} 
          />
        </CardTitle>
        <CardDescription>
          <MatchingCardDescription match={match} perspective={perspective} />
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 매칭 점수 구성 요소 */}
        <MatchingScoreDisplay match={match} />

        {/* 매칭된 키워드 하이라이트 */}
        <MatchingKeywordSection matchedKeywords={match.matchedKeywords} />

        {/* 주요 엔티티 설명 */}
        <MatchingDescriptionSection match={match} perspective={perspective} />

        {/* 특징 아이콘 - 관점에 따라 다르게 표시 */}
        <MatchingFeatureIcons supplier={match.supplier} perspective={perspective} />

        {/* 상대방 정보 간략 표시 */}
        <MatchingContextSection 
          match={match} 
          perspective={perspective} 
          showGroupContext={showGroupContext} 
        />

        {/* 액션 버튼 */}
        <MatchingActionButtons
          match={match}
          interestData={interestData}
          commentCount={commentCount}
          onInterestClick={handleInterestClick}
          onCommentAdded={handleCommentAdded}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedMatchingCard;
