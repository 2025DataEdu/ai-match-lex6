import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText, Sparkles, Users, Target, Zap, TrendingUp, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import MatchingStats from "@/components/ai-matching/MatchingStats";
import { useStats } from "@/hooks/useStats";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const Index = () => {
  const { stats, isLoading } = useStats();

  const pieData = [
    { name: '공급기업', value: stats.suppliersCount, color: '#3B82F6' },
    { name: '수요기관', value: stats.demandsCount, color: '#10B981' }
  ];

  const barData = [
    { name: '공급기업', count: stats.suppliersCount, color: '#3B82F6' },
    { name: '수요기관', count: stats.demandsCount, color: '#10B981' },
    { name: 'AI매칭', count: stats.matchesCount, color: '#8B5CF6' }
  ];

  const chartConfig = {
    suppliers: { label: "공급기업", color: "#3B82F6" },
    demands: { label: "수요기관", color: "#10B981" },
    matches: { label: "AI매칭", color: "#8B5CF6" }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Quick Actions */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI 기술매칭 플랫폼
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              공공기관과 민간 기술기업을 연결하는 스마트 매칭 서비스
            </p>
          </div>

          {/* Quick Registration Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 min-w-[200px]">
              <Link to="/supplier-registration" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                공급기업 등록하기
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 min-w-[200px]">
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
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              플랫폼 현황 통계
            </h2>
            <p className="text-xl text-gray-600">
              실시간으로 업데이트되는 플랫폼 이용 현황을 확인하세요
            </p>
          </div>

          {/* Stats Cards */}
          <MatchingStats 
            suppliersCount={stats.suppliersCount}
            demandsCount={stats.demandsCount}
            matchesCount={stats.matchesCount}
          />

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Pie Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">등록 현황 분포</h3>
                </div>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">카테고리별 현황</h3>
                </div>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="count" fill="#3B82F6" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Growth Indicators */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">이번 달 신규 공급기업</p>
                    <p className="text-2xl font-bold text-blue-600">+{Math.floor(stats.suppliersCount * 0.2)}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">이번 달 신규 수요기관</p>
                    <p className="text-2xl font-bold text-green-600">+{Math.floor(stats.demandsCount * 0.15)}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">성공적인 매칭</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.matchesCount}</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
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
