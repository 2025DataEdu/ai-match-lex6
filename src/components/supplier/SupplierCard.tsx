
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Youtube, FileText } from "lucide-react";

interface Supplier {
  공급기업일련번호: string;
  기업명: string;
  유형: string;
  업종: string;
  세부설명: string;
  기업홈페이지?: string;
  유튜브링크?: string;
  보유특허?: string;
  사용자명?: string;
  등록일자?: string;
}

interface SupplierCardProps {
  supplier: Supplier;
  index: number;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('ko-KR');
  } catch {
    return dateString;
  }
};

export const SupplierCard = ({ supplier, index }: SupplierCardProps) => {
  return (
    <Card key={supplier.공급기업일련번호 || index} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{supplier.기업명}</CardTitle>
            <CardDescription>
              {supplier.업종} {supplier.사용자명 && `· ${supplier.사용자명}`}
            </CardDescription>
          </div>
          {supplier.유형 && (
            <Badge variant="secondary">{supplier.유형}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {supplier.세부설명 && (
            <p className="text-sm text-gray-700 line-clamp-3">
              {supplier.세부설명}
            </p>
          )}
          
          {supplier.보유특허 && (
            <div className="text-sm">
              <div className="font-medium text-gray-700 mb-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                보유특허
              </div>
              <p className="text-gray-600 text-xs line-clamp-2">
                {supplier.보유특허}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {supplier.기업홈페이지 && (
              <Button variant="outline" size="sm" asChild>
                <a href={supplier.기업홈페이지} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  홈페이지
                </a>
              </Button>
            )}
            {supplier.유튜브링크 && (
              <Button variant="outline" size="sm" asChild>
                <a href={supplier.유튜브링크} target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-3 h-3 mr-1" />
                  유튜브
                </a>
              </Button>
            )}
          </div>

          {supplier.등록일자 && (
            <div className="pt-2 text-xs text-gray-500">
              등록일: {formatDate(supplier.등록일자)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
