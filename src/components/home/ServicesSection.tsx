
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ServicesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const services = [
    {
      icon: Building2,
      title: "공급기업",
      subtitle: "Technology Provider",
      description: "AI개발, 컨설팅, 교육 등 다양한 기술 서비스를 제공하는 기업들을 위한 플랫폼",
      features: ["기술력 검증", "프로젝트 매칭", "성과 관리", "네트워킹"],
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      registerLink: "/supplier-registration",
      browseLink: "/suppliers"
    },
    {
      icon: Users,
      title: "수요기관",
      subtitle: "Demand Organization",
      description: "공공기관 및 기업체의 기술 도입 수요를 효율적으로 관리하고 매칭",
      features: ["수요 분석", "업체 추천", "계약 지원", "사후 관리"],
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      registerLink: "/demand-registration",
      browseLink: "/demands"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={titleVariants}
          >
            주요 서비스
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={titleVariants}
          >
            공급기업과 수요기관을 위한 비즈니스 매칭 서비스를 제공합니다
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.3 }
              }}
            >
              <Card className="relative h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden group">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardContent className="relative p-10">
                  <div className="flex items-center mb-8">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mr-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">주요 기능</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 text-${service.color}-500`} />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        asChild 
                        className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg transition-all duration-300 text-white border-0 py-6 text-lg font-semibold`}
                      >
                        <Link to={service.registerLink} className="flex items-center justify-center gap-2">
                          {service.title} 등록하기
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        asChild 
                        className={`w-full border-2 border-${service.color}-200 text-${service.color}-700 hover:bg-${service.color}-50 py-6 text-lg font-semibold transition-all duration-300`}
                      >
                        <Link to={service.browseLink} className="flex items-center justify-center gap-2">
                          {service.title === "공급기업" ? "공급기업 둘러보기" : "수요내용 둘러보기"}
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
