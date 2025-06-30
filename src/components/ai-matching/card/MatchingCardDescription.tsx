
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { DetailedMatch } from "@/types/matching";

interface MatchingCardDescriptionProps {
  match: DetailedMatch;
  perspective: 'demand' | 'supplier';
}

const MatchingCardDescription = ({ match, perspective }: MatchingCardDescriptionProps) => {
  return (
    <div className="flex items-center gap-2">
      {perspective === 'demand' ? (
        <>
          <Badge variant="outline">{match.supplier.유형}</Badge>
          <span>•</span>
          <span>{match.supplier.업종}</span>
        </>
      ) : (
        <>
          <Badge variant="outline">{match.demand.유형}</Badge>
          {match.demand.금액 && (
            <>
              <span>•</span>
              <DollarSign className="w-4 h-4 text-green-600" />
              <span>{new Intl.NumberFormat('ko-KR').format(match.demand.금액)} 원</span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MatchingCardDescription;
