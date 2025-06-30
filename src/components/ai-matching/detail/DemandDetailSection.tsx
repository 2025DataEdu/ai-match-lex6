
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Award, Calendar, DollarSign } from "lucide-react";
import { Demand } from "@/types/matching";

interface DemandDetailSectionProps {
  demand: Demand;
}

const DemandDetailSection = ({ demand }: DemandDetailSectionProps) => {
  return (
    <div className="bg-green-50 p-6 rounded-lg space-y-4">
      <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        수요기관 상세 정보
      </h4>
      
      <div className="space-y-3">
        <div>
          <div className="font-medium text-lg">{demand.수요기관}</div>
          <Badge variant="outline" className="mt-2">{demand.유형}</Badge>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <FileText className="w-4 h-4" />
            수요 내용
          </div>
          <p className="text-sm text-gray-600 bg-white p-3 rounded border">
            {demand.수요내용}
          </p>
        </div>

        {demand.추출키워드 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Award className="w-4 h-4" />
              AI 추출 키워드
            </div>
            <div className="flex flex-wrap gap-1">
              {demand.추출키워드.split(',').map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {demand.금액 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              예산
            </div>
            <div className="text-lg font-semibold text-green-600">
              {new Intl.NumberFormat('ko-KR').format(demand.금액)} 원
            </div>
          </div>
        )}

        {demand.등록일자 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              등록일
            </div>
            <p className="text-sm text-gray-600">{demand.등록일자}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandDetailSection;
