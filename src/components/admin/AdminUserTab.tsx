
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminUser {
  아이디: string;
  이메일: string;
  이름: string;
  연락처: string;
  기업명: string;
  부서명: string;
  유형: string;
  등록일자: string;
}

interface AdminUserTabProps {
  users: AdminUser[];
  onDelete: (userId: string) => void;
}

export const AdminUserTab = ({ users, onDelete }: AdminUserTabProps) => {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록된 사용자가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          전체 사용자 관리 ({users.length}명)
        </CardTitle>
        <CardDescription>
          시스템에 등록된 모든 사용자를 관리할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>아이디</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>기업명</TableHead>
                <TableHead>부서명</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.아이디}>
                  <TableCell className="font-medium">{user.아이디}</TableCell>
                  <TableCell>{user.이름}</TableCell>
                  <TableCell>{user.이메일}</TableCell>
                  <TableCell>{user.기업명}</TableCell>
                  <TableCell>{user.부서명}</TableCell>
                  <TableCell>{user.연락처}</TableCell>
                  <TableCell>{user.유형}</TableCell>
                  <TableCell>{user.등록일자}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(user.아이디)}
                      disabled={user.아이디 === 'admin'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
