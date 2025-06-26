
import { motion } from "framer-motion";

interface HeroTitleProps {
  variants: any;
}

const HeroTitle = ({ variants }: HeroTitleProps) => {
  return (
    <>
      {/* Main Title with Gradient Animation */}
      <motion.h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight" variants={variants}>
        <motion.span 
          className="block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent" 
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }} 
          transition={{
            duration: 5,
            repeat: Infinity
          }}
        >
          스마트 매칭의
        </motion.span>
        <motion.span 
          className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent" 
          animate={{
            backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"]
          }} 
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 0.5
          }}
        >
          새로운 시대
        </motion.span>
      </motion.h1>
      
      {/* Enhanced Description */}
      <motion.div className="text-xl md:text-3xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed space-y-4" variants={variants}>
        <p className="text-blue-100">
          공공기관의 <span className="font-bold text-white">혁신적 수요</span>와 민간 기술기업의{" "}
          <span className="font-bold text-cyan-300">창의적 솔루션</span>을 연결하는
        </p>
        <motion.p 
          className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent" 
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }} 
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        >
          AI 기반 지능형 플랫폼
        </motion.p>
      </motion.div>
    </>
  );
};

export default HeroTitle;
