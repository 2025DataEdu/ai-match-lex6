
import { ScrollArea } from "@/components/ui/scroll-area";
import EnhancedMatchingCard from "./EnhancedMatchingCard";
import { DetailedMatch } from "@/utils/matchingAlgorithm";

interface MatchingResultsProps {
  matches: DetailedMatch[];
  onInterestClick: (match: DetailedMatch) => void;
  onInquiryClick: (match: DetailedMatch) => void;
}

const MatchingResults = ({ matches, onInterestClick, onInquiryClick }: MatchingResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          매칭 결과 ({matches.length}개)
        </h2>
      </div>
      
      <ScrollArea className="h-[800px] w-full">
        <div className="space-y-6 pr-4">
          {matches.map((match, index) => (
            <EnhancedMatchingCard
              key={`${match.supplier.공급기업일련번호}-${match.demand.수요기관일련번호}`}
              match={match}
              index={index}
              onInterestClick={onInterestClick}
              onInquiryClick={onInquiryClick}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MatchingResults;
