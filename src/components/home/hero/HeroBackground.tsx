
import { motion } from "framer-motion";
import { Building2, Users, Zap, Target } from "lucide-react";

const HeroBackground = () => {
  return (
    <>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-radial-gradient"></div>
        <div className="absolute inset-0 bg-conic-gradient animate-spin-slow"></div>
      </div>
      
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Floating Elements with Enhanced Animation */}
      <motion.div 
        className="absolute top-20 left-16 text-blue-300/20" 
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, -5, 0]
        }} 
        transition={{
          duration: 6,
          repeat: Infinity
        }}
      >
        <Building2 size={120} />
        <motion.div 
          className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full" 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }} 
          transition={{
            duration: 3,
            repeat: Infinity
          }} 
        />
      </motion.div>
      
      <motion.div 
        className="absolute top-32 right-20 text-purple-300/20" 
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, -5, 0]
        }} 
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 1.5
        }}
      >
        <Users size={80} />
        <motion.div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full" 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }} 
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0.5
          }} 
        />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-32 left-32 text-cyan-300/20" 
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, -5, 0]
        }} 
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 3
        }}
      >
        <Zap size={60} />
      </motion.div>
      
      <motion.div 
        className="absolute top-64 right-40 text-yellow-300/20" 
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, -5, 0]
        }} 
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 2
        }}
      >
        <Target size={70} />
      </motion.div>

      {/* Gradient Orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }} 
        transition={{
          duration: 8,
          repeat: Infinity
        }} 
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-full blur-3xl" 
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4]
        }} 
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: 2
        }} 
      />

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </>
  );
};

export default HeroBackground;
