
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Youtube, FileText } from "lucide-react";
import { Heart, HeartOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useInterest } from "@/hooks/useInterest";

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
  const { getInterestData, toggleInterest } = useInterest();
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  // 더미 수요기관 ID (실제로는 현재 사용자의 수요기관 ID를 사용해야 함)
  const dummyDemandID = "dummy-demand-id";

  useEffect(() => {
    const interestData = getInterestData(supplier.공급기업일련번호, dummyDemandID);
    setIsInterested(interestData.사용자관심여부);
    setInterestCount(interestData.관심수);
  }, [supplier.공급기업일련번호, getInterestData]);

  const handleInterestToggle = async () => {
    await toggleInterest(supplier.공급기업일련번호, dummyDemandID);
    const updatedData = getInterestData(supplier.공급기업일련번호, dummyDemandID);
    setIsInterested(updatedData.사용자관심여부);
    setInterestCount(updatedData.관심수);
  };

  return (
    <Card key={supplier.공급기업일련번호 || index} className="hover:shadow-lg transition-shadow relative">
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

        {/* 관심 표시 버튼 */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInterestToggle}
            className="p-2 hover:bg-gray-100"
          >
            {isInterested ? (
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            ) : (
              <HeartOff className="w-5 h-5 text-gray-400" />
            )}
            {interestCount > 0 && (
              <span className="ml-1 text-xs text-gray-500">{interestCount}</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
