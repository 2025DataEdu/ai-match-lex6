
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, ArrowRight, Calendar, Globe, Youtube, FileText, Mail, DollarSign } from "lucide-react";
import { Match } from "@/types/matching";

interface MatchingDetailModalProps {
  match: Match;
  getScoreColor: (score: number) => string;
}

const MatchingDetailModal = ({ match, getScoreColor }: MatchingDetailModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <span>상세 매칭 정보</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>매칭 상세 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* 매칭 점수 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">매칭 분석</h4>
            <div className="flex items-center space-x-4 mb-2">
              <div className={`w-4 h-4 rounded-full ${getScoreColor(match.matchScore)}`}></div>
              <span className="font-medium">매칭도: {match.matchScore}%</span>
            </div>
            <p className="text-sm text-gray-600">{match.matchReason}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 공급기업 상세 정보 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                공급기업 상세 정보
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-lg">{match.supplier.기업명}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{match.supplier.유형}</Badge>
                    {match.supplier.업종 && (
                      <Badge variant="secondary">{match.supplier.업종}</Badge>
                    )}
                  </div>
                </div>
                
                {match.supplier.세부설명 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      서비스 설명
                    </p>
                    <p className="text-sm text-gray-600">{match.supplier.세부설명}</p>
                  </div>
                )}

                {match.supplier.보유특허 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">보유 특허</p>
                    <p className="text-sm text-gray-600">{match.supplier.보유특허}</p>
                  </div>
                )}

                {match.supplier.사용자명 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      담당자
                    </p>
                    <p className="text-sm text-gray-600">{match.supplier.사용자명}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {match.supplier.기업홈페이지 && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={match.supplier.기업홈페이지} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-1" />
                        홈페이지
                      </a>
                    </Button>
                  )}
                  {match.supplier.유튜브링크 && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={match.supplier.유튜브링크} target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-4 h-4 mr-1" />
                        유튜브
                      </a>
                    </Button>
                  )}
                </div>

                {match.supplier.등록일자 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      등록일
                    </p>
                    <p className="text-sm text-gray-600">{match.supplier.등록일자}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 수요기관 상세 정보 */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                수요기관 상세 정보
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-lg">{match.demand.수요기관}</p>
                  <Badge variant="outline" className="mt-1">{match.demand.유형}</Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    수요 내용
                  </p>
                  <p className="text-sm text-gray-600">{match.demand.수요내용}</p>
                </div>

                {match.demand.금액 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      예산
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {new Intl.NumberFormat('ko-KR').format(match.demand.금액)} 원
                    </p>
                  </div>
                )}

                {match.demand.등록일자 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      등록일
                    </p>
                    <p className="text-sm text-gray-600">{match.demand.등록일자}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchingDetailModal;
