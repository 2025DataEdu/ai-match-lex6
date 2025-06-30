
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Award, Globe, Youtube, Calendar, Mail, User, Phone } from "lucide-react";
import { Supplier } from "@/types/matching";

interface SupplierDetailSectionProps {
  supplier: Supplier;
  showContactInfo: boolean;
}

const SupplierDetailSection = ({ supplier, showContactInfo }: SupplierDetailSectionProps) => {
  return (
    <div className="bg-blue-50 p-6 rounded-lg space-y-4">
      <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        공급기업 상세 정보
      </h4>
      
      <div className="space-y-3">
        <div>
          <div className="font-medium text-lg">{supplier.기업명}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{supplier.유형}</Badge>
            {supplier.업종 && (
              <Badge variant="secondary">{supplier.업종}</Badge>
            )}
          </div>
        </div>
        
        {supplier.세부설명 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              서비스 설명
            </div>
            <p className="text-sm text-gray-600 bg-white p-3 rounded border">
              {supplier.세부설명}
            </p>
          </div>
        )}

        {supplier.추출키워드 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Award className="w-4 h-4" />
              AI 추출 키워드
            </div>
            <div className="flex flex-wrap gap-1">
              {supplier.추출키워드.split(',').map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {supplier.보유특허 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Award className="w-4 h-4" />
              보유 특허/자격증
            </div>
            <p className="text-sm text-gray-600 bg-white p-3 rounded border">
              {supplier.보유특허}
            </p>
          </div>
        )}

        {showContactInfo && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-1">
              <Mail className="w-4 h-4" />
              연락처 정보
            </div>
            <div className="space-y-2">
              {supplier.사용자명 && (
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">담당자:</span>
                  <span>{supplier.사용자명}</span>
                </div>
              )}
              {supplier.이메일 && (
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">이메일:</span>
                  <a href={`mailto:${supplier.이메일}`} className="text-blue-600 hover:underline">
                    {supplier.이메일}
                  </a>
                </div>
              )}
              {supplier.연락처 && (
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">전화번호:</span>
                  <a href={`tel:${supplier.연락처}`} className="text-blue-600 hover:underline">
                    {supplier.연락처}
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
          {supplier.기업홈페이지 && (
            <Button size="sm" variant="outline" asChild>
              <a href={supplier.기업홈페이지} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-1" />
                홈페이지
              </a>
            </Button>
          )}
          {supplier.유튜브링크 && (
            <Button size="sm" variant="outline" asChild>
              <a href={supplier.유튜브링크} target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 mr-1" />
                유튜브
              </a>
            </Button>
          )}
        </div>

        {supplier.등록일자 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              등록일
            </div>
            <p className="text-sm text-gray-600">{supplier.등록일자}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDetailSection;
