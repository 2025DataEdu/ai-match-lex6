
import { DetailedMatch } from "@/types/matching";

interface MatchingScoreDisplayProps {
  match: DetailedMatch;
}

const MatchingScoreDisplay = ({ match }: MatchingScoreDisplayProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div className="text-center">
        <div className="font-semibold text-blue-600">{match.keywordScore?.toFixed(0) || 0}</div>
        <div className="text-xs text-gray-500">키워드</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-green-600">{((match.capabilityScore || 0) * 0.75).toFixed(0)}</div>
        <div className="text-xs text-gray-500">서비스유형</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-orange-600">{((match.capabilityScore || 0) * 0.25).toFixed(0)}</div>
        <div className="text-xs text-gray-500">업종</div>
      </div>
    </div>
  );
};

export default MatchingScoreDisplay;
