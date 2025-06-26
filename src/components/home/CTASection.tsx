
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const CTASection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
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

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotation: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-16 left-16 text-yellow-300/20"
        variants={floatingVariants}
        animate="animate"
      >
        <Sparkles size={60} />
      </motion.div>
      <motion.div 
        className="absolute top-24 right-20 text-blue-300/20"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Zap size={80} />
      </motion.div>
      <motion.div 
        className="absolute bottom-20 left-1/4 text-purple-300/20"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Sparkles size={40} />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
            variants={itemVariants}
          >
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">지금 시작하세요</span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            지금 바로 AI매칭을
            <br />
            경험해보세요
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            최적의 비즈니스 파트너를 찾는 가장 스마트한 방법
            <br />
            <span className="text-blue-200 font-semibold">몇 분 안에 완벽한 매칭을 경험하세요</span>
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 px-10 py-6 rounded-full font-bold text-lg shadow-2xl border-2 border-white/20"
              >
                <Link to="/ai-matching" className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  무료로 매칭 시작하기
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white/50 text-white hover:bg-white/10 px-10 py-6 rounded-full font-bold text-lg backdrop-blur-sm"
              >
                <Link to="/suppliers" className="flex items-center gap-3">
                  서비스 둘러보기
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/20"
            variants={itemVariants}
          >
            <p className="text-blue-200 mb-6 font-medium">신뢰받는 파트너들</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="font-semibold">500+ 기업</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="font-semibold">200+ 기관</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="font-semibold">95% 성공률</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
