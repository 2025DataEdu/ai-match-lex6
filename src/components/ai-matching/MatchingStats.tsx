
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Sparkles } from "lucide-react";

interface MatchingStatsProps {
  suppliersCount: number;
  demandsCount: number;
  matchesCount: number;
}

const MatchingStats = ({ suppliersCount, demandsCount, matchesCount }: MatchingStatsProps) => {
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
            <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{matchesCount}</p>
              <p className="text-sm text-gray-600">AI 매칭 결과</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchingStats;
