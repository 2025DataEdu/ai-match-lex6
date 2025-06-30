
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Target } from "lucide-react";

interface MatchingStatsProps {
  suppliersCount: number;
  demandsCount: number;
  matchingSuccessRate: number;
}

const MatchingStats = ({ suppliersCount, demandsCount, matchingSuccessRate }: MatchingStatsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{suppliersCount}</p>
              <p className="text-sm text-gray-600">등록된 공급기업</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{demandsCount}</p>
              <p className="text-sm text-gray-600">등록된 수요기관</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{matchingSuccessRate}%</p>
              <p className="text-sm text-gray-600">매칭 성공률</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchingStats;
