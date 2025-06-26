
import { motion } from "framer-motion";
import HeroBackground from "./hero/HeroBackground";
import HeroBadge from "./hero/HeroBadge";
import HeroTitle from "./hero/HeroTitle";
import HeroStats from "./hero/HeroStats";

const HeroSection = () => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <HeroBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <motion.div className="text-center" variants={containerVariants} initial="hidden" animate="visible">
          <HeroBadge variants={itemVariants} />
          <HeroTitle variants={itemVariants} />
          <HeroStats />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
