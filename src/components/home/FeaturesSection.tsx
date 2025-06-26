
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Shield, BarChart3, Clock, Sparkles } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "AI 기반 스마트 매칭",
      description: "머신러닝 알고리즘을 통해 최적의 비즈니스 파트너를 자동으로 찾아드립니다.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Target,
      title: "정확한 수요-공급 매칭",
      description: "기업의 기술력과 공공기관의 요구사항을 정밀하게 분석하여 매칭합니다.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Shield,
      title: "신뢰할 수 있는 플랫폼",
      description: "검증된 기업과 기관만이 참여하는 안전하고 신뢰할 수 있는 환경을 제공합니다.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: BarChart3,
      title: "실시간 분석 리포트",
      description: "매칭 현황과 성과를 실시간으로 분석하여 상세한 리포트를 제공합니다.",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Clock,
      title: "빠른 매칭 프로세스",
      description: "기존 대비 80% 단축된 시간으로 빠르고 효율적인 매칭을 경험하세요.",
      color: "from-red-400 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Sparkles,
      title: "맞춤형 추천 시스템",
      description: "기업의 특성과 선호도를 학습하여 개인화된 추천 서비스를 제공합니다.",
      color: "from-indigo-400 to-purple-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium">
              핵심 기능
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            왜 우리 플랫폼을 선택해야 할까요?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            AI 기술과 데이터 분석을 통해 최적의 비즈니스 매칭 경험을 제공합니다.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Decorative gradient line */}
                  <div className={`w-12 h-1 bg-gradient-to-r ${feature.color} rounded-full mx-auto mt-6`}></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
