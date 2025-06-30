
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface KeywordMatchingSectionProps {
  matchedKeywords: string[];
}

const KeywordMatchingSection = ({ matchedKeywords }: KeywordMatchingSectionProps) => {
  if (matchedKeywords.length === 0) return null;

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-600" />
        키워드 매칭 현황
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {matchedKeywords.map((keyword, idx) => (
          <Badge key={idx} variant="secondary" className="justify-center py-2 bg-green-100 text-green-800">
            {keyword}
          </Badge>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600">
        총 {matchedKeywords.length}개의 키워드가 매칭되었습니다.
      </div>
    </div>
  );
};

export default KeywordMatchingSection;
