
import { motion } from "framer-motion";
import { Building2, Users, Sparkles } from "lucide-react";
import { useStats } from "@/hooks/useStats";

const HeroStats = () => {
  const { stats, isLoading } = useStats();

  const statsData = [
    {
      number: isLoading ? "..." : `${stats.suppliersCount}+`,
      label: "등록된 공급기업",
      icon: Building2,
      color: "from-blue-400 to-cyan-400"
    }, 
    {
      number: isLoading ? "..." : `${stats.demandsCount}+`,
      label: "수요기관",
      icon: Users,
      color: "from-purple-400 to-pink-400"
    }, 
    {
      number: isLoading ? "..." : `${Math.round((stats.matchesCount / Math.max(stats.suppliersCount, 1)) * 100)}%`,
      label: "매칭 성공률",
      icon: Sparkles,
      color: "from-yellow-400 to-orange-400"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-8" 
      initial={{
        opacity: 0,
        y: 100
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        delay: 1.2,
        duration: 1
      }}
    >
      {statsData.map((stat, index) => (
        <motion.div 
          key={index} 
          className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl group" 
          whileHover={{
            scale: 1.05,
            y: -10,
            boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
          }} 
          transition={{
            duration: 0.3
          }} 
          initial={{
            opacity: 0,
            y: 50
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          style={{
            transitionDelay: `${1.5 + index * 0.2}s`
          }}
        >
          <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
            <stat.icon className="w-8 h-8 text-white" />
          </div>
          <motion.div 
            className="text-4xl md:text-5xl font-bold mb-3" 
            animate={{
              scale: [1, 1.1, 1]
            }} 
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.5
            }}
          >
            {stat.number}
          </motion.div>
          <div className="text-blue-200 font-semibold text-lg">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HeroStats;
