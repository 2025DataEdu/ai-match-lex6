
import { Progress } from "@/components/ui/progress";
import { DetailedMatch } from "@/types/matching";

interface MatchingScoreBreakdownProps {
  match: DetailedMatch;
}

const MatchingScoreBreakdown = ({ match }: MatchingScoreBreakdownProps) => {
  const keywordScore = match.keywordScore || 0;
  const serviceTypeScore = (match.capabilityScore || 0) * 0.75;
  const industryScore = (match.capabilityScore || 0) * 0.25;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
      <h4 className="font-semibold mb-4 text-lg">매칭 점수 구성 (총 {match.matchScore}점)</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{keywordScore.toFixed(1)}점</div>
          <div className="text-sm text-gray-600">키워드 매칭 (60%)</div>
          <Progress value={keywordScore} className="mt-2" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{serviceTypeScore.toFixed(1)}점</div>
          <div className="text-sm text-gray-600">서비스 유형 (30%)</div>
          <Progress value={serviceTypeScore} className="mt-2" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{industryScore.toFixed(1)}점</div>
          <div className="text-sm text-gray-600">업종 매칭 (10%)</div>
          <Progress value={industryScore} className="mt-2" />
        </div>
      </div>
      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <div className="text-sm font-medium mb-1">매칭 근거</div>
        <p className="text-sm text-gray-600">{match.matchReason}</p>
      </div>
    </div>
  );
};

export default MatchingScoreBreakdown;
