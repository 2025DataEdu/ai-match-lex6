
import { Badge } from "@/components/ui/badge";
import { Building2, Users, DollarSign } from "lucide-react";
import { DetailedMatch } from "@/types/matching";

interface MatchingCardHeaderProps {
  match: DetailedMatch;
  perspective: 'demand' | 'supplier';
  matchScore: number;
}

const MatchingCardHeader = ({ match, perspective, matchScore }: MatchingCardHeaderProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-lg flex items-center gap-2">
        {perspective === 'demand' ? (
          <>
            <Building2 className="w-5 h-5 text-blue-600" />
            {match.supplier.기업명}
          </>
        ) : (
          <>
            <Users className="w-5 h-5 text-green-600" />
            {match.demand.수요기관}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getScoreColor(matchScore)}`}></div>
        <Badge variant="secondary" className="font-semibold">
          {matchScore}% 매칭
        </Badge>
      </div>
    </div>
  );
};

export default MatchingCardHeader;
