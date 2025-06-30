
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, Heart, Award, Globe, Youtube, DollarSign } from "lucide-react";
import { DetailedMatch } from "@/types/matching";
import EnhancedMatchingDetailModal from "./EnhancedMatchingDetailModal";
import InquiryCommentModal from "./InquiryCommentModal";
import { useInquiryComments } from "@/hooks/useInquiryComments";
import { useState, useEffect } from "react";

interface EnhancedMatchingCardProps {
  match: DetailedMatch;
  index: number;
  onInterestClick: (match: DetailedMatch) => void;
  onInquiryClick: (match: DetailedMatch) => void;
  showGroupContext?: boolean;
  perspective?: 'demand' | 'supplier';
  interestData?: {
    관심수: number;
    사용자관심여부: boolean;
  };
  onToggleInterest: (공급기업일련번호: string, 수요기관일련번호: string) => void;
}

const EnhancedMatchingCard = ({ 
  match, 
  index, 
  onInterestClick, 
  onInquiryClick,
  showGroupContext = true,
  perspective = 'demand',
  interestData,
  onToggleInterest
}: EnhancedMatchingCardProps) => {
  const [commentCount, setCommentCount] = useState(0);
  const { getCommentCount } = useInquiryComments();

  const matchingId = `${match.supplier.공급기업일련번호}_${match.demand.수요기관일련번호}`;

  useEffect(() => {
    const fetchCommentCount = async () => {
      const count = await getCommentCount(matchingId);
      setCommentCount(count);
    };
    fetchCommentCount();
  }, [matchingId, getCommentCount]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "높음";
    if (score >= 60) return "보통";
    return "낮음";
  };

  const handleInterestClick = () => {
    onToggleInterest(match.supplier.공급기업일련번호, match.demand.수요기관일련번호);
  };

  const handleCommentAdded = async () => {
    const count = await getCommentCount(matchingId);
    setCommentCount(count);
  };

  // 관점에 따라 주요 표시할 엔티티 결정
  const mainEntity = perspective === 'demand' ? match.supplier : match.demand;
  const counterEntity = perspective === 'demand' ? match.demand : match.supplier;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
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
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(match.matchScore)}`}></div>
            <Badge variant="secondary" className="font-semibold">
              {match.matchScore}% 매칭
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2">
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
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 매칭 점수 진행률 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>매칭도</span>
            <span className="font-medium">{getScoreText(match.matchScore)}</span>
          </div>
          <Progress value={match.matchScore} className="h-2" />
        </div>

        {/* 매칭된 키워드 하이라이트 */}
        {match.matchedKeywords.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">주요 매칭 키워드</div>
            <div className="flex flex-wrap gap-1">
              {match.matchedKeywords.slice(0, 4).map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 주요 엔티티 설명 */}
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

        {/* 특징 아이콘 - 관점에 따라 다르게 표시 */}
        {perspective === 'demand' && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {match.supplier.보유특허 && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>특허보유</span>
              </div>
            )}
            {match.supplier.기업홈페이지 && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>홈페이지</span>
              </div>
            )}
            {match.supplier.유튜브링크 && (
              <div className="flex items-center gap-1">
                <Youtube className="w-4 h-4" />
                <span>유튜브</span>
              </div>
            )}
          </div>
        )}

        {/* 상대방 정보 간략 표시 */}
        {showGroupContext && (
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
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={interestData?.사용자관심여부 ? "default" : "outline"}
            size="sm"
            onClick={handleInterestClick}
            className="flex items-center gap-1 flex-1"
          >
            <Heart className={`w-4 h-4 ${interestData?.사용자관심여부 ? 'fill-current' : ''}`} />
            관심표시
            {interestData && interestData.관심수 > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                {interestData.관심수}
              </Badge>
            )}
          </Button>
          <InquiryCommentModal 
            match={match} 
            commentCount={commentCount}
            onCommentAdded={handleCommentAdded}
          />
          <EnhancedMatchingDetailModal 
            match={match} 
            showContactInfo={interestData?.사용자관심여부 || false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMatchingCard;
