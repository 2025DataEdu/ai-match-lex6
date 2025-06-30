
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Building2, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminSupplier {
  공급기업일련번호: string;
  기업명: string;
  사용자명: string;
  유형: string;
  업종: string;
  세부설명: string;
  등록일자: string;
  아이디: string;
}

interface AdminSupplierTabProps {
  suppliers: AdminSupplier[];
  onEdit: (supplier: AdminSupplier) => void;
  onDelete: (supplierId: string) => void;
}

export const AdminSupplierTab = ({ suppliers, onEdit, onDelete }: AdminSupplierTabProps) => {
  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록된 공급기업이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          전체 공급기업 관리 ({suppliers.length}개)
        </CardTitle>
        <CardDescription>
          시스템에 등록된 모든 공급기업을 관리할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>기업명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>업종</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>등록자</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.공급기업일련번호}>
                  <TableCell className="font-medium">{supplier.기업명}</TableCell>
                  <TableCell>{supplier.유형}</TableCell>
                  <TableCell>{supplier.업종}</TableCell>
                  <TableCell>{supplier.사용자명}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {supplier.아이디}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.등록일자}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(supplier)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(supplier.공급기업일련번호)}
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
