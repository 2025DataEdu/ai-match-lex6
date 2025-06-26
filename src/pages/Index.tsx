
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import FloatingChatBot from "@/components/FloatingChatBot";
import { useStats } from "@/hooks/useStats";

const Index = () => {
  const { stats, isLoading } = useStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <StatisticsSection stats={stats} />
      <CTASection />
      <Footer />
      <FloatingChatBot />
    </div>
  );
};

export default Index;
