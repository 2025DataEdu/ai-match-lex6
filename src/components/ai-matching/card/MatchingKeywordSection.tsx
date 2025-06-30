
import { Badge } from "@/components/ui/badge";

interface MatchingKeywordSectionProps {
  matchedKeywords: string[];
}

const MatchingKeywordSection = ({ matchedKeywords }: MatchingKeywordSectionProps) => {
  if (matchedKeywords.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">주요 매칭 키워드</div>
      <div className="flex flex-wrap gap-1">
        {matchedKeywords.slice(0, 4).map((keyword, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
            {keyword}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MatchingKeywordSection;
