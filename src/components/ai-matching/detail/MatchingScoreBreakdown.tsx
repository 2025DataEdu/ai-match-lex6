
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DetailedMatch } from "@/types/matching";

interface MatchingScoreBreakdownProps {
  match: DetailedMatch;
}

const MatchingScoreBreakdown = ({ match }: MatchingScoreBreakdownProps) => {
  const keywordScore = match.keywordScore || 0;
  const serviceTypeScore = match.serviceTypeScore || 0;
  const industryScore = match.industryScore || 0;
  const bonusScore = match.bonusScore || 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
      <h4 className="font-semibold mb-4 text-lg">매칭 점수 상세 분석 (총 {match.matchScore}점)</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{keywordScore.toFixed(1)}점</div>
          <div className="text-sm text-gray-600">키워드 매칭 (60%)</div>
          <Progress value={keywordScore} className="mt-2" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{serviceTypeScore.toFixed(1)}점</div>
          <div className="text-sm text-gray-600">서비스 유형 (35%)</div>
          <Progress value={serviceTypeScore} className="mt-2" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{industryScore.toFixed(1)}점</div>
          <div className="text-sm text-gray-600">업종 매칭 (5%)</div>
          <Progress value={industryScore} className="mt-2" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{bonusScore}점</div>
          <div className="text-sm text-gray-600">보너스 점수</div>
          <Progress value={bonusScore} className="mt-2" />
        </div>
      </div>

      {/* 매칭된 키워드 상세 */}
      {match.matchedKeywords && match.matchedKeywords.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium mb-2 text-blue-800">매칭된 키워드 ({match.matchedKeywords.length}개)</div>
          <div className="flex flex-wrap gap-2">
            {match.matchedKeywords.map((keyword, idx) => (
              <Badge key={idx} className="bg-blue-100 text-blue-800">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 매칭된 서비스 유형 상세 */}
      {match.matchedServiceTypes && match.matchedServiceTypes.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm font-medium mb-2 text-green-800">매칭된 서비스 유형 ({match.matchedServiceTypes.length}개)</div>
          <div className="flex flex-wrap gap-2">
            {match.matchedServiceTypes.map((serviceType, idx) => (
              <Badge key={idx} className="bg-green-100 text-green-800">
                {serviceType}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <div className="text-sm font-medium mb-1">매칭 근거</div>
        <p className="text-sm text-gray-600">{match.matchReason}</p>
      </div>
    </div>
  );
};

export default MatchingScoreBreakdown;
