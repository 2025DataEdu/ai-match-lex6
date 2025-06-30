
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminDemand {
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
  아이디: string;
}

interface AdminDemandTabProps {
  demands: AdminDemand[];
  onEdit: (demand: AdminDemand) => void;
  onDelete: (demandId: string) => void;
}

export const AdminDemandTab = ({ demands, onEdit, onDelete }: AdminDemandTabProps) => {
  if (demands.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록된 수요내용이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          전체 수요내용 관리 ({demands.length}개)
        </CardTitle>
        <CardDescription>
          시스템에 등록된 모든 수요내용을 관리할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>수요기관</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>수요내용</TableHead>
                <TableHead>예산</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>등록자</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demands.map((demand) => (
                <TableRow key={demand.수요기관일련번호}>
                  <TableCell className="font-medium">{demand.수요기관}</TableCell>
                  <TableCell>{demand.유형}</TableCell>
                  <TableCell className="max-w-xs truncate" title={demand.수요내용}>
                    {demand.수요내용}
                  </TableCell>
                  <TableCell>{demand.금액?.toLocaleString()}원</TableCell>
                  <TableCell>{demand.사용자명}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {demand.아이디}
                    </div>
                  </TableCell>
                  <TableCell>{demand.등록일자}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
