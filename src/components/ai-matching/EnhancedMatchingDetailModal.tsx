
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart } from "lucide-react";
import { DetailedMatch } from "@/types/matching";
import MatchingScoreBreakdown from "./detail/MatchingScoreBreakdown";
import KeywordMatchingSection from "./detail/KeywordMatchingSection";
import SupplierDetailSection from "./detail/SupplierDetailSection";
import DemandDetailSection from "./detail/DemandDetailSection";
import ContactInfoNotice from "./detail/ContactInfoNotice";

interface EnhancedMatchingDetailModalProps {
  match: DetailedMatch;
  showContactInfo?: boolean;
}

const EnhancedMatchingDetailModal = ({ match, showContactInfo = false }: EnhancedMatchingDetailModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <BarChart className="w-4 h-4" />
          상세분석
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            매칭 상세 분석
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 매칭 점수 상세 분석 */}
          <MatchingScoreBreakdown match={match} />

          {/* 키워드 매칭 현황 */}
          <KeywordMatchingSection matchedKeywords={match.matchedKeywords} />

          <div className="grid md:grid-cols-2 gap-6">
            {/* 공급기업 상세 정보 */}
            <SupplierDetailSection 
              supplier={match.supplier} 
              showContactInfo={showContactInfo}
            />

            {/* 수요기관 상세 정보 */}
            <DemandDetailSection demand={match.demand} />
          </div>

          {/* 연락처 정보 안내 */}
          <ContactInfoNotice showContactInfo={showContactInfo} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMatchingDetailModal;
