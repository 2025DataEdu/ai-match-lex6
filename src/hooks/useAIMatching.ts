
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand } from "@/types/matching";
import { calculateMatchingScore, DetailedMatch } from "@/utils/matchingAlgorithm";

export const useAIMatching = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [matches, setMatches] = useState<DetailedMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<DetailedMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);

  // 필터 상태
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  // 필터링 및 정렬 적용
  useEffect(() => {
    console.log('필터링 시작:', {
      매칭결과수: matches.length,
      선택된업종: selectedIndustry,
      점수범위: scoreRange
    });

    let filtered = [...matches];

    // 업종 필터
    if (selectedIndustry !== "all") {
      filtered = filtered.filter(match => {
        const matchResult = match.supplier.업종 === selectedIndustry;
        console.log('업종 필터 결과:', {
          기업명: match.supplier.기업명,
          업종: match.supplier.업종,
          선택된업종: selectedIndustry,
          매칭여부: matchResult
        });
        return matchResult;
      });
    }

    // 점수 범위 필터
    filtered = filtered.filter(match => {
      const matchResult = match.matchScore >= scoreRange[0] && match.matchScore <= scoreRange[1];
      console.log('점수 필터 결과:', {
        기업명: match.supplier.기업명,
        매칭점수: match.matchScore,
        점수범위: scoreRange,
        매칭여부: matchResult
      });
      return matchResult;
    });

    // 정렬
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "matchScore":
          aValue = a.matchScore;
          bValue = b.matchScore;
          break;
        case "등록일자":
          aValue = new Date(a.supplier.등록일자 || "").getTime() || 0;
          bValue = new Date(b.supplier.등록일자 || "").getTime() || 0;
          break;
        case "기업명":
          aValue = a.supplier.기업명 || "";
          bValue = b.supplier.기업명 || "";
          break;
        case "capabilityScore":
          aValue = a.capabilityScore;
          bValue = b.capabilityScore;
          break;
        default:
          aValue = a.matchScore;
          bValue = b.matchScore;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    console.log('필터링 완료:', {
      필터링전: matches.length,
      필터링후: filtered.length
    });

    setFilteredMatches(filtered);
  }, [matches, selectedIndustry, scoreRange, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      const [suppliersResponse, demandsResponse] = await Promise.all([
        supabase.from('공급기업').select('*'),
        supabase.from('수요기관').select('*')
      ]);

      console.log('데이터 로드 결과:', {
        suppliers: suppliersResponse.data?.length || 0,
        demands: demandsResponse.data?.length || 0,
        suppliersData: suppliersResponse.data?.slice(0, 2),
        demandsData: demandsResponse.data?.slice(0, 2)
      });

      if (suppliersResponse.error || demandsResponse.error) {
        console.error('데이터 로드 오류:', {
          suppliersError: suppliersResponse.error,
          demandsError: demandsResponse.error
        });
        toast({
          title: "데이터 로드 실패",
          description: "데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        setSuppliers(suppliersResponse.data || []);
        setDemands(demandsResponse.data || []);
      }
    } catch (error) {
      console.error('데이터 fetch 오류:', error);
      toast({
        title: "오류 발생",
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMatches = () => {
    setIsMatching(true);
    
    console.log('매칭 계산 시작:', { 
      suppliers: suppliers.length, 
      demands: demands.length,
      samplesSuppliers: suppliers.slice(0, 2),
      sampleDemands: demands.slice(0, 2)
    });
    
    // 개선된 매칭 알고리즘 실행
    setTimeout(() => {
      const newMatches: DetailedMatch[] = [];
      
      demands.forEach(demand => {
        suppliers.forEach(supplier => {
          const match = calculateMatchingScore(demand, supplier);
          
          // 20점 이상일 때만 매칭 결과에 포함 (기준 낮춤)
          if (match.matchScore >= 20) {
            newMatches.push(match);
          }
        });
      });

      console.log('매칭 계산 완료:', { 
        totalMatches: newMatches.length,
        sampleMatches: newMatches.slice(0, 3).map(m => ({
          기업명: m.supplier.기업명,
          수요기관: m.demand.수요기관,
          매칭점수: m.matchScore
        }))
      });

      // 점수 순으로 정렬하고 상위 50개 표시
      const sortedMatches = newMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 50);

      setMatches(sortedMatches);
      setIsMatching(false);
      
      toast({
        title: "AI 매칭 완료",
        description: `${sortedMatches.length}개의 매칭 결과를 찾았습니다.`,
      });
    }, 2000);
  };

  const clearFilters = () => {
    setSelectedIndustry("all");
    setScoreRange([0, 100]);
    setSortBy("matchScore");
    setSortOrder("desc");
  };

  const hasActiveFilters = selectedIndustry !== "all" || 
    scoreRange[0] !== 0 || scoreRange[1] !== 100;

  const industries = Array.from(new Set(suppliers.map(s => s.업종).filter(Boolean)));

  return {
    suppliers,
    demands,
    matches,
    filteredMatches,
    isLoading,
    isMatching,
    selectedIndustry,
    setSelectedIndustry,
    scoreRange,
    setScoreRange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    calculateMatches,
    clearFilters,
    hasActiveFilters,
    industries
  };
};
