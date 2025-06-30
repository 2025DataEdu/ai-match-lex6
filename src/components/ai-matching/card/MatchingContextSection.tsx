
import { Building2, Users, DollarSign } from "lucide-react";
import { DetailedMatch } from "@/types/matching";

interface MatchingContextSectionProps {
  match: DetailedMatch;
  perspective: 'demand' | 'supplier';
  showGroupContext: boolean;
}

const MatchingContextSection = ({ match, perspective, showGroupContext }: MatchingContextSectionProps) => {
  if (!showGroupContext) return null;

  return (
    <div className={`${perspective === 'demand' ? 'bg-green-50' : 'bg-blue-50'} p-3 rounded-lg`}>
      <div className="flex items-center gap-2 text-sm">
        {perspective === 'demand' ? (
          <>
            <Users className="w-4 h-4 text-green-600" />
            <span className="font-medium">{match.demand.수요기관}</span>
            {match.demand.금액 && (
              <>
                <span>•</span>
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>{new Intl.NumberFormat('ko-KR').format(match.demand.금액)} 원</span>
              </>
            )}
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{match.supplier.기업명}</span>
            <span>•</span>
            <span>{match.supplier.업종}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchingContextSection;
