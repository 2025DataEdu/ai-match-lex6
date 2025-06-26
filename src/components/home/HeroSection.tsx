
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
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

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            수요-공급 매칭 플랫폼
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90"
            variants={itemVariants}
          >
            공공기관의 수요과 민간 기술기업을 연결하는 스마트 매칭 서비스
          </motion.p>
        </motion.div>

        {/* Quick Registration Actions */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={buttonVariants} whileHover="hover">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 min-w-[200px]">
              <Link to="/supplier-registration" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                공급기업 등록하기
              </Link>
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants} whileHover="hover">
            <Button size="lg" asChild className="bg-green-600 text-white hover:bg-green-700 min-w-[200px]">
              <Link to="/demand-registration" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                수요기관 등록하기
              </Link>
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants} whileHover="hover">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 min-w-[200px]">
              <Link to="/ai-matching" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI매칭 시작하기
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
