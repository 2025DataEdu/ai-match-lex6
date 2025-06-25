
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Zap } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            왜 AI매치허브를 선택해야 할까요?
          </h2>
          <p className="text-xl text-gray-600">
            효율적이고 정확한 매칭으로 최적의 파트너를 찾아드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI 스마트 매칭</h3>
              <p className="text-gray-600">
                인공지능 기술로 수요와 공급을 정확하게 분석하여 최적의 매칭을 제공합니다
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">정확한 타겟팅</h3>
              <p className="text-gray-600">
                업종, 기술분야, 예산 등 다양한 조건을 고려한 정밀한 매칭 서비스
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">빠른 연결</h3>
              <p className="text-gray-600">
                실시간 알림과 간편한 연락 시스템으로 신속한 비즈니스 연결
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
