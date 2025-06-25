
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;
