
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Building2 } from "lucide-react";

interface Supplier {
  공급기업일련번호: string;
  기업명: string;
  사용자명: string;
  유형: string;
  업종: string;
  세부설명: string;
  등록일자: string;
}

interface SupplierTabProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

export const SupplierTab = ({ suppliers, onEdit, onDelete }: SupplierTabProps) => {
  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록한 공급기업이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {suppliers.map((supplier) => (
        <Card key={supplier.공급기업일련번호}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{supplier.기업명}</CardTitle>
                <CardDescription>
                  {supplier.유형} • {supplier.업종}
                </CardDescription>
              </div>
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
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{supplier.세부설명}</p>
            <p className="text-xs text-gray-500">
              담당자: {supplier.사용자명} • 등록일: {supplier.등록일자}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
