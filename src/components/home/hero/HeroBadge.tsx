
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface HeroBadgeProps {
  variants: any;
}

const HeroBadge = ({ variants }: HeroBadgeProps) => {
  return (
    <motion.div 
      className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-blue-300/10 backdrop-blur-md rounded-full px-8 py-4 mb-12 border border-white/20 shadow-2xl" 
      variants={variants} 
      whileHover={{
        scale: 1.05,
        y: -5
      }}
    >
      <motion.div 
        animate={{
          rotate: 360
        }} 
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <Sparkles className="w-6 h-6 text-yellow-300" />
      </motion.div>
      <span className="text-lg font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
        Next Generation AI 매칭
      </span>
      <motion.div 
        animate={{
          scale: [1, 1.2, 1]
        }} 
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
      </motion.div>
    </motion.div>
  );
};

export default HeroBadge;
