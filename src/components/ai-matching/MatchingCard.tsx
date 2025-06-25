
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users } from "lucide-react";
import { Match } from "@/types/matching";
import MatchingDetailModal from "./MatchingDetailModal";

interface MatchingCardProps {
  match: Match;
  index: number;
  getScoreColor: (score: number) => string;
  getScoreText: (score: number) => string;
}

const MatchingCard = ({ match, index, getScoreColor, getScoreText }: MatchingCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">매칭 #{index + 1}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(match.matchScore)}`}></div>
            <Badge variant="secondary">
              매칭도: {match.matchScore}% ({getScoreText(match.matchScore)})
            </Badge>
          </div>
        </div>
        <CardDescription>
          {match.matchReason}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 공급기업 정보 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              공급기업
            </h4>
            <div className="space-y-2">
              <p className="font-medium">{match.supplier.기업명}</p>
              <Badge variant="outline">{match.supplier.유형}</Badge>
              {match.supplier.업종 && (
                <p className="text-sm text-gray-600">업종: {match.supplier.업종}</p>
              )}
              <p className="text-sm text-gray-700 line-clamp-2">
                {match.supplier.세부설명}
              </p>
            </div>
          </div>

          {/* 수요기관 정보 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              수요기관
            </h4>
            <div className="space-y-2">
              <p className="font-medium">{match.demand.수요기관}</p>
              <Badge variant="outline">{match.demand.유형}</Badge>
              {match.demand.금액 && (
                <p className="text-sm text-gray-600">
                  예산: {new Intl.NumberFormat('ko-KR').format(match.demand.금액)} 만원
                </p>
              )}
              <p className="text-sm text-gray-700 line-clamp-2">
                {match.demand.수요내용}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <MatchingDetailModal match={match} getScoreColor={getScoreColor} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingCard;
