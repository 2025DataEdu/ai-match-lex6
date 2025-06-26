
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, ArrowRight, Calendar, Globe, Youtube, FileText, Mail, Award, BarChart, Phone, User, DollarSign } from "lucide-react";
import { DetailedMatch } from "@/utils/matchingAlgorithm";

interface EnhancedMatchingDetailModalProps {
  match: DetailedMatch;
  showContactInfo?: boolean;
}

const EnhancedMatchingDetailModal = ({ match, showContactInfo = false }: EnhancedMatchingDetailModalProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <BarChart className="w-4 h-4" />
          상세분석
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            매칭 상세 분석
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 매칭 점수 상세 분석 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 text-lg">매칭 점수 분석</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{match.matchScore}%</div>
                <div className="text-sm text-gray-600">총 매칭도</div>
                <Progress value={match.matchScore} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{match.keywordScore}%</div>
                <div className="text-sm text-gray-600">키워드 유사도</div>
                <Progress value={match.keywordScore} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{match.capabilityScore}%</div>
                <div className="text-sm text-gray-600">기업 역량</div>
                <Progress value={match.capabilityScore} className="mt-2" />
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <div className="text-sm font-medium mb-1">매칭 근거</div>
              <p className="text-sm text-gray-600">{match.matchReason}</p>
            </div>
          </div>

          {/* 키워드 매칭 현황 */}
          {match.matchedKeywords.length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                키워드 매칭 현황
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {match.matchedKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="justify-center py-2 bg-green-100 text-green-800">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                총 {match.matchedKeywords.length}개의 키워드가 매칭되었습니다.
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* 공급기업 상세 정보 */}
            <div className="bg-blue-50 p-6 rounded-lg space-y-4">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                공급기업 상세 정보
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-lg">{match.supplier.기업명}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{match.supplier.유형}</Badge>
                    {match.supplier.업종 && (
                      <Badge variant="secondary">{match.supplier.업종}</Badge>
                    )}
                  </div>
                </div>
                
                {match.supplier.세부설명 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      서비스 설명
                    </div>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {match.supplier.세부설명}
                    </p>
                  </div>
                )}

                {match.supplier.보유특허 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      보유 특허/자격증
                    </div>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {match.supplier.보유특허}
                    </p>
                  </div>
                )}

                {/* 연락처 정보 - 관심 표시한 경우에만 표시 */}
                {showContactInfo && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      연락처 정보
                    </div>
                    <div className="space-y-2">
                      {match.supplier.사용자명 && (
                        <div className="text-sm text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">담당자:</span>
                          <span>{match.supplier.사용자명}</span>
                        </div>
                      )}
                      {match.supplier.이메일 && (
                        <div className="text-sm text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">이메일:</span>
                          <a href={`mailto:${match.supplier.이메일}`} className="text-blue-600 hover:underline">
                            {match.supplier.이메일}
                          </a>
                        </div>
                      )}
                      {match.supplier.연락처 && (
                        <div className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">전화번호:</span>
                          <a href={`tel:${match.supplier.연락처}`} className="text-blue-600 hover:underline">
                            {match.supplier.연락처}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-yellow-700 mt-3 bg-yellow-100 p-2 rounded">
                      💡 관심표시를 해주셔서 연락처 정보가 공개되었습니다.
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
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
                    <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      등록일
                    </div>
                    <p className="text-sm text-gray-600">{match.supplier.등록일자}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 수요기관 상세 정보 */}
            <div className="bg-green-50 p-6 rounded-lg space-y-4">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                수요기관 상세 정보
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-lg">{match.demand.수요기관}</div>
                  <Badge variant="outline" className="mt-2">{match.demand.유형}</Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    수요 내용
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                    {match.demand.수요내용}
                  </p>
                </div>

                {match.demand.금액 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      예산
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {new Intl.NumberFormat('ko-KR').format(match.demand.금액)} 원
                    </div>
                  </div>
                )}

                {match.demand.등록일자 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      등록일
                    </div>
                    <p className="text-sm text-gray-600">{match.demand.등록일자}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 연락처 정보 안내 */}
          {!showContactInfo && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                <Mail className="w-5 h-5" />
                연락처 정보 안내
              </div>
              <p className="text-sm text-yellow-700">
                상세한 연락처 정보(이메일, 전화번호)는 '관심표시'를 누른 후에 공개됩니다. 
                양쪽 당사자의 동의 하에 연결됩니다.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMatchingDetailModal;
