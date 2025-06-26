
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, ArrowRight, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 text-blue-300/30"
        variants={floatingVariants}
        animate="animate"
      >
        <Building2 size={80} />
      </motion.div>
      <motion.div 
        className="absolute top-32 right-16 text-purple-300/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Users size={60} />
      </motion.div>
      <motion.div 
        className="absolute bottom-20 left-20 text-blue-200/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Sparkles size={50} />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16" 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20"
            variants={itemVariants}
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">AI 기반 스마트 매칭</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            수요-공급 매칭
            <br />
            <span className="text-4xl md:text-6xl">플랫폼</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            공공기관의 수요와 민간 기술기업을 연결하는 
            <br className="hidden md:block" />
            <span className="font-semibold text-blue-200">AI 스마트 매칭 서비스</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button 
                asChild 
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 rounded-full font-semibold text-lg shadow-2xl border-2 border-white/20"
              >
                <Link to="/ai-matching" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI 매칭 시작하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-6 rounded-full font-semibold text-lg backdrop-blur-sm"
              >
                <Link to="/suppliers" className="flex items-center gap-2">
                  둘러보기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[
            { number: "500+", label: "등록된 공급기업", icon: Building2 },
            { number: "200+", label: "수요기관", icon: Users },
            { number: "95%", label: "매칭 성공률", icon: Sparkles }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-200 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
