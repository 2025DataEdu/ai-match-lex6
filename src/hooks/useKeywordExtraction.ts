
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useKeywordExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const extractKeywords = async (text: string, type: 'supplier' | 'demand', recordId: string) => {
    if (!text || text.trim().length < 10) {
      console.log('텍스트가 너무 짧아 키워드 추출을 건너뜁니다.');
      return null;
    }

    setIsExtracting(true);
    
    try {
      console.log('키워드 추출 시작:', { type, recordId, textLength: text.length });

      const { data, error } = await supabase.functions.invoke('extract-keywords', {
        body: {
          text: text.trim(),
          type,
          recordId
        }
      });

      if (error) {
        console.error('키워드 추출 오류:', error);
        throw new Error(error.message || '키워드 추출에 실패했습니다.');
      }

      if (!data?.success) {
        throw new Error(data?.error || '키워드 추출 응답이 올바르지 않습니다.');
      }

      console.log('키워드 추출 완료:', data.keywords);

      toast({
        title: "키워드 추출 완료",
        description: `AI가 핵심 키워드를 추출했습니다: ${data.keywords.substring(0, 50)}...`,
      });

      return data.keywords;

    } catch (error) {
      console.error('키워드 추출 실패:', error);
      
      toast({
        title: "키워드 추출 실패",
        description: error.message || "키워드 추출 중 오류가 발생했습니다.",
        variant: "destructive",
      });

      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  const batchExtractKeywords = async (records: Array<{id: string, text: string, type: 'supplier' | 'demand'}>) => {
    const results = [];
    
    for (const record of records) {
      const keywords = await extractKeywords(record.text, record.type, record.id);
      results.push({ id: record.id, keywords });
      
      // API 호출 간격을 두어 rate limit 방지
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  };

  return {
    extractKeywords,
    batchExtractKeywords,
    isExtracting
  };
};
