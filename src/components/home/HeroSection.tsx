import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
const HeroSection = () => {
  return <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">수요-공급 매칭 플랫폼</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">공공기관의 수요과 민간 기술기업을 연결하는 스마트 매칭 서비스</p>
        </div>

        {/* Quick Registration Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 min-w-[200px]">
            <Link to="/supplier-registration" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              공급기업 등록하기
            </Link>
          </Button>
          <Button size="lg" asChild className="bg-green-600 text-white hover:bg-green-700 min-w-[200px]">
            <Link to="/demand-registration" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              수요기관 등록하기
            </Link>
          </Button>
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 min-w-[200px]">
            <Link to="/ai-matching" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI매칭 시작하기
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default HeroSection;