
import { DetailedMatch } from "@/types/matching";

interface MatchingScoreDisplayProps {
  match: DetailedMatch;
}

const MatchingScoreDisplay = ({ match }: MatchingScoreDisplayProps) => {
  return (
    <div className="space-y-3">
      {/* 총 매칭 점수 */}
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{match.matchScore}점</div>
        <div className="text-xs text-gray-500">총 매칭 점수</div>
      </div>
      
      {/* 점수 구성 요소 (간단히) */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div className="text-center">
          <div className="font-medium">{match.keywordScore?.toFixed(0) || 0}</div>
          <div>키워드</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{match.serviceTypeScore?.toFixed(0) || 0}</div>
          <div>서비스</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{match.bonusScore || 0}</div>
          <div>보너스</div>
        </div>
      </div>
    </div>
  );
};

export default MatchingScoreDisplay;
