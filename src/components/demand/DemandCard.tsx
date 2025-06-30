
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, DollarSign, Edit } from "lucide-react";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useInterest } from "@/hooks/useInterest";
import { DemandEditModal } from "./DemandEditModal";
import { supabase } from "@/integrations/supabase/client";

interface Demand {
  수요기관일련번호: string;
  수요기관: string;
  부서명: string;
  사용자명: string;
  유형: string;
  수요내용: string;
  금액: number;
  시작일: string;
  종료일: string;
  기타요구사항: string;
  등록일자: string;
  아이디?: string;
}

interface DemandCardProps {
  demand: Demand;
  onUpdate?: () => void;
}

const DemandCard = ({ demand, onUpdate }: DemandCardProps) => {
  const { getInterestData, toggleInterest } = useInterest();
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [currentUserSupplierId, setCurrentUserSupplierId] = useState<string>("general-supplier");

  useEffect(() => {
    const checkEditPermission = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email && demand.아이디) {
        const currentUserId = session.user.email.split('@')[0];
        setCanEdit(currentUserId === demand.아이디);
      }

      // 실제 사용자의 공급기업 ID를 가져오거나 일반적인 ID 사용
      if (session?.user) {
        const userId = session.user.email?.split('@')[0] || session.user.id;
        setCurrentUserSupplierId(`supplier-${userId}`);
      }
    };

    checkEditPermission();
  }, [demand.아이디]);

  useEffect(() => {
    const interestData = getInterestData(currentUserSupplierId, demand.수요기관일련번호);
    setIsInterested(interestData.사용자관심여부);
    setInterestCount(interestData.관심수);
  }, [demand.수요기관일련번호, currentUserSupplierId, getInterestData]);

  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('ko-KR').format(amount) + ' 원';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const handleInterestToggle = async () => {
    await toggleInterest(currentUserSupplierId, demand.수요기관일련번호);
    const updatedData = getInterestData(currentUserSupplierId, demand.수요기관일련번호);
    setIsInterested(updatedData.사용자관심여부);
    setInterestCount(updatedData.관심수);
  };

  const handleEditComplete = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  // 1억 이상인 경우 강조 표시를 위한 스타일 결정
  const isHighBudget = demand.금액 && demand.금액 >= 100000000; // 1억원

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow relative ${isHighBudget ? 'border-orange-300 bg-orange-50' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{demand.수요기관 || '기관명 없음'}</CardTitle>
              <CardDescription>
                {demand.부서명 && `${demand.부서명} · `}{demand.사용자명 || '담당자명 없음'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2 items-end">
                {demand.유형 && demand.유형 !== '일반' && (
                  <Badge variant="secondary">{demand.유형}</Badge>
                )}
                {isHighBudget && (
                  <Badge variant="destructive" className="text-xs">고액 수요</Badge>
                )}
              </div>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 hover:bg-gray-100"
                  title="편집"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demand.수요내용 && (
              <p className="text-sm text-gray-700 line-clamp-3">
                {demand.수요내용}
              </p>
            )}
            
            {demand.금액 && (
              <div className={`flex items-center space-x-2 text-sm ${isHighBudget ? 'text-orange-600 font-bold' : 'text-green-600'}`}>
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{formatCurrency(demand.금액)}</span>
                {isHighBudget && <span className="text-xs">(1억원 이상)</span>}
              </div>
            )}

            {(demand.시작일 || demand.종료일) && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {demand.시작일 && formatDate(demand.시작일)}
                  {demand.시작일 && demand.종료일 && ' ~ '}
                  {demand.종료일 && formatDate(demand.종료일)}
                </span>
              </div>
            )}
            
            {demand.기타요구사항 && (
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-1">기타 요구사항</div>
                <p className="text-gray-600 text-xs line-clamp-2">
                  {demand.기타요구사항}
                </p>
              </div>
            )}

            {demand.등록일자 && (
              <div className="pt-2 text-xs text-gray-500">
                등록일: {formatDate(demand.등록일자)}
              </div>
            )}
          </div>

          {/* 관심 표시 버튼 */}
          <div className="absolute bottom-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInterestToggle}
              className="p-2 hover:bg-gray-100 flex items-center gap-1"
              title={isInterested ? "관심 취소" : "관심 표시"}
            >
              {isInterested ? (
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              ) : (
                <Heart className="w-5 h-5 text-gray-400" />
              )}
              {interestCount > 0 && (
                <span className="text-xs text-gray-600 font-medium">{interestCount}</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DemandEditModal
        demand={demand}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleEditComplete}
      />
    </>
  );
};

export default DemandCard;
