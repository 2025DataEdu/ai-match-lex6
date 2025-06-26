import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";
const ServicesSection = () => {
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            주요 서비스
          </h2>
          <p className="text-xl text-gray-600">공급기업과 수요기관을 위한 비즈니스 매칭 서비스를 제공합니다</p>
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
    </section>;
};
export default ServicesSection;