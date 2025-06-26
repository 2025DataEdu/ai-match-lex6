
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, DollarSign } from "lucide-react";

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
}

interface DemandCardProps {
  demand: Demand;
}

const DemandCard = ({ demand }: DemandCardProps) => {
  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('ko-KR').format(amount) + ' 만원';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 1억 이상인 경우 강조 표시를 위한 스타일 결정
  const isHighBudget = demand.금액 && demand.금액 >= 10000; // 1억원 (만원 단위로 10000)

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isHighBudget ? 'border-orange-300 bg-orange-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{demand.수요기관 || '기관명 없음'}</CardTitle>
            <CardDescription>
              {demand.부서명 && `${demand.부서명} · `}{demand.사용자명 || '담당자명 없음'}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {demand.유형 && (
              <Badge variant="secondary">{demand.유형}</Badge>
            )}
            {isHighBudget && (
              <Badge variant="destructive" className="text-xs">고액 수요</Badge>
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
      </CardContent>
    </Card>
  );
};

export default DemandCard;
