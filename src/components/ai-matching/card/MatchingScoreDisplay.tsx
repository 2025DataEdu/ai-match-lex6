
import { DetailedMatch } from "@/types/matching";
import { Badge } from "@/components/ui/badge";

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
      
      {/* 매칭된 키워드 */}
      {match.matchedKeywords && match.matchedKeywords.length > 0 && (
        <div>
          <div className="text-sm font-medium text-blue-700 mb-1">매칭 키워드</div>
          <div className="flex flex-wrap gap-1">
            {match.matchedKeywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                {keyword}
              </Badge>
            ))}
            {match.matchedKeywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{match.matchedKeywords.length - 3}개
              </Badge>
            )}
          </div>
        </div>
      )}
      
      {/* 매칭된 서비스 유형 */}
      {match.matchedServiceTypes && match.matchedServiceTypes.length > 0 && (
        <div>
          <div className="text-sm font-medium text-green-700 mb-1">매칭 서비스</div>
          <div className="flex flex-wrap gap-1">
            {match.matchedServiceTypes.slice(0, 2).map((serviceType, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-700">
                {serviceType}
              </Badge>
            ))}
            {match.matchedServiceTypes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{match.matchedServiceTypes.length - 2}개
              </Badge>
            )}
          </div>
        </div>
      )}
      
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
