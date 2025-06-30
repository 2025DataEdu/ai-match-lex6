
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Target, TrendingUp } from "lucide-react";
import MatchingStats from "@/components/ai-matching/MatchingStats";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

interface StatisticsProps {
  stats: {
    suppliersCount: number;
    demandsCount: number;
    matchesCount: number;
    matchingSuccessRate: number;
  };
}

const StatisticsSection = ({ stats }: StatisticsProps) => {
  const pieData = [
    {
      name: '공급기업',
      value: stats.suppliersCount,
      color: '#3B82F6'
    },
    {
      name: '수요기관',
      value: stats.demandsCount,
      color: '#10B981'
    }
  ];

  const barData = [
    {
      name: '공급기업',
      count: stats.suppliersCount,
      color: '#3B82F6'
    },
    {
      name: '수요기관',
      count: stats.demandsCount,
      color: '#10B981'
    },
    {
      name: '매칭성공률',
      count: stats.matchingSuccessRate,
      color: '#8B5CF6'
    }
  ];

  const chartConfig = {
    suppliers: {
      label: "공급기업",
      color: "#3B82F6"
    },
    demands: {
      label: "수요기관",
      color: "#10B981"
    },
    successRate: {
      label: "매칭성공률",
      color: "#8B5CF6"
    }
  };

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">등록 현황 통계</h2>
          <p className="text-xl text-gray-600">
            실시간으로 업데이트되는 플랫폼 이용 현황을 확인하세요
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
        >
          <MatchingStats 
            suppliersCount={stats.suppliersCount} 
            demandsCount={stats.demandsCount} 
            matchingSuccessRate={stats.matchingSuccessRate} 
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Pie Chart */}
          <motion.div variants={chartVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">등록 현황 분포</h3>
                </div>
                <div className="h-[250px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={60} 
                          dataKey="value" 
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div variants={chartVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">카테고리별 현황</h3>
                </div>
                <div className="h-[250px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={barData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="count" fill="#3B82F6" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;
