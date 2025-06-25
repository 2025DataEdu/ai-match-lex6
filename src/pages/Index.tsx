import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText, Sparkles, Users, Target, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI 기술매칭 플랫폼
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            공공기관과 민간 기술기업을 연결하는 스마트 매칭 서비스
          </p>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              주요 서비스
            </h2>
            <p className="text-xl text-gray-600">
              공급기업과 수요기관을 위한 전문 서비스를 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold">공급기업</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  AI개발, 컨설팅, 교육 등 다양한 기술 서비스를 제공하는 기업들을 위한 플랫폼
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/supplier-registration">공급기업 등록하기</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/suppliers">공급기업 둘러보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold">수요기관</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  공공기관 및 기업체의 기술 도입 수요를 효율적으로 관리하고 매칭
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link to="/demand-registration">수요기관 등록하기</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    <Link to="/demands">수요내용 둘러보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 AI매칭을 경험해보세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            최적의 비즈니스 파트너를 찾는 가장 스마트한 방법
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/ai-matching">AI매칭 시작하기</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold">AI매치허브</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 AI매치허브. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
