
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, ArrowRight, Building2, Users, Zap, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-radial-gradient"></div>
        <div className="absolute inset-0 bg-conic-gradient animate-spin-slow"></div>
      </div>
      
      {/* Dynamic Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <motion.div 
          className="text-center" 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          {/* Badge with Enhanced Animation */}
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-blue-300/10 backdrop-blur-md rounded-full px-8 py-4 mb-12 border border-white/20 shadow-2xl" 
            variants={itemVariants} 
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
          
          {/* Main Title with Gradient Animation */}
          <motion.h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight" variants={itemVariants}>
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
          <motion.div className="text-xl md:text-3xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed space-y-4" variants={itemVariants}>
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

          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20" 
            variants={itemVariants}
          >
            <motion.div variants={buttonVariants} whileHover="hover">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/25 border-0 transform transition-all duration-300"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  지금 시작하기
                  <motion.div 
                    className="ml-3" 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={buttonVariants} whileHover="hover">
              <Link to="/ai-matching">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-md transition-all duration-300"
                >
                  <TrendingUp className="w-6 h-6 mr-3" />
                  매칭 체험하기
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats Row */}
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
            {[
              {
                number: "500+",
                label: "등록된 공급기업",
                icon: Building2,
                color: "from-blue-400 to-cyan-400"
              },
              {
                number: "200+",
                label: "수요기관",
                icon: Users,
                color: "from-purple-400 to-pink-400"
              },
              {
                number: "95%",
                label: "매칭 성공률",
                icon: Sparkles,
                color: "from-yellow-400 to-orange-400"
              }
            ].map((stat, index) => (
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
        </motion.div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
