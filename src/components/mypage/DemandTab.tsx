
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText } from "lucide-react";

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

interface DemandTabProps {
  demands: Demand[];
  onEdit: (demand: Demand) => void;
  onDelete: (demandId: string) => void;
}

export const DemandTab = ({ demands, onEdit, onDelete }: DemandTabProps) => {
  if (demands.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록한 수요내용이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {demands.map((demand) => (
        <Card key={demand.수요기관일련번호}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{demand.수요기관}</CardTitle>
                <CardDescription>
                  {demand.유형} • {demand.부서명}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(demand)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(demand.수요기관일련번호)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{demand.수요내용}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>담당자: {demand.사용자명}</span>
              <span>예산: {demand.금액?.toLocaleString()}원</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              기간: {demand.시작일} ~ {demand.종료일} • 등록일: {demand.등록일자}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
