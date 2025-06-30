
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { DetailedMatch } from "@/types/matching";
import EnhancedMatchingDetailModal from "../EnhancedMatchingDetailModal";
import InquiryCommentModal from "../InquiryCommentModal";

interface MatchingActionButtonsProps {
  match: DetailedMatch;
  interestData?: {
    관심수: number;
    사용자관심여부: boolean;
  };
  commentCount: number;
  onInterestClick: () => void;
  onCommentAdded: () => void;
}

const MatchingActionButtons = ({ 
  match, 
  interestData, 
  commentCount, 
  onInterestClick, 
  onCommentAdded 
}: MatchingActionButtonsProps) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button
        variant={interestData?.사용자관심여부 ? "default" : "outline"}
        size="sm"
        onClick={onInterestClick}
        className="flex items-center gap-1 flex-1"
      >
        <Heart className={`w-4 h-4 ${interestData?.사용자관심여부 ? 'fill-current' : ''}`} />
        관심표시
        {interestData && interestData.관심수 > 0 && (
          <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
            {interestData.관심수}
          </Badge>
        )}
      </Button>
      <InquiryCommentModal 
        match={match} 
        commentCount={commentCount}
        onCommentAdded={onCommentAdded}
      />
      <EnhancedMatchingDetailModal 
        match={match} 
        showContactInfo={interestData?.사용자관심여부 || false}
      />
    </div>
  );
};

export default MatchingActionButtons;
