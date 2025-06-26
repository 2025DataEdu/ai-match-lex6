
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DemandHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">수요내용</h1>
        <p className="text-lg text-gray-600">
          공공기관 및 기업체의 기술 서비스 수요를 확인해보세요
        </p>
      </div>
      <Button 
        onClick={() => navigate('/demand-registration')}
        className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        수요등록
      </Button>
    </div>
  );
};

export default DemandHeader;
