
import { Award, Globe, Youtube } from "lucide-react";
import { Supplier } from "@/types/matching";

interface MatchingFeatureIconsProps {
  supplier: Supplier;
  perspective: 'demand' | 'supplier';
}

const MatchingFeatureIcons = ({ supplier, perspective }: MatchingFeatureIconsProps) => {
  if (perspective !== 'demand') return null;

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      {supplier.보유특허 && (
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4" />
          <span>특허보유</span>
        </div>
      )}
      {supplier.기업홈페이지 && (
        <div className="flex items-center gap-1">
          <Globe className="w-4 h-4" />
          <span>홈페이지</span>
        </div>
      )}
      {supplier.유튜브링크 && (
        <div className="flex items-center gap-1">
          <Youtube className="w-4 h-4" />
          <span>유튜브</span>
        </div>
      )}
    </div>
  );
};

export default MatchingFeatureIcons;
