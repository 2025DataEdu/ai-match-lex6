
import { DetailedMatch } from "@/types/matching";

interface MatchingDescriptionSectionProps {
  match: DetailedMatch;
  perspective: 'demand' | 'supplier';
}

const MatchingDescriptionSection = ({ match, perspective }: MatchingDescriptionSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">
        {perspective === 'demand' ? '기업 소개' : '수요 내용'}
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">
        {perspective === 'demand' ? (
          <>
            {match.supplier.세부설명?.slice(0, 100)}
            {match.supplier.세부설명 && match.supplier.세부설명.length > 100 && '...'}
          </>
        ) : (
          <>
            {match.demand.수요내용?.slice(0, 100)}
            {match.demand.수요내용 && match.demand.수요내용.length > 100 && '...'}
          </>
        )}
      </p>
    </div>
  );
};

export default MatchingDescriptionSection;
