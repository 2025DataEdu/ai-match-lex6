
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Supplier, Demand } from "@/types/matching";
import { calculateMatchingScore, DetailedMatch, groupAndSortMatches } from "@/utils/matchingAlgorithm";

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
  const [matchingPerspective, setMatchingPerspective] = useState<'demand' | 'supplier'>('demand');
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  // 필터링 및 정렬 적용
  useEffect(() => {
    console.log('필터링 시작:', {
      매칭결과수: matches.length,
      선택된업종: selectedIndustry,
      점수범위: scoreRange,
      매칭관점: matchingPerspective,
      검색어: searchTerm
    });

    let filtered = [...matches];

    // 업종 필터
    if (selectedIndustry !== "all") {
      filtered = filtered.filter(match => match.supplier.업종 === selectedIndustry);
    }

    // 점수 범위 필터
    filtered = filtered.filter(match => 
      match.matchScore >= scoreRange[0] && match.matchScore <= scoreRange[1]
    );

    // 검색 필터
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(match => {
        if (matchingPerspective === 'demand') {
          return match.demand.수요기관?.toLowerCase().includes(searchLower);
        } else {
          return match.supplier.기업명?.toLowerCase().includes(searchLower);
        }
      });
    }

    // 관점별 그룹화 및 정렬 적용
    const sortedAndGrouped = groupAndSortMatches(filtered, matchingPerspective, sortBy, sortOrder);

    console.log('필터링 완료:', {
      필터링전: matches.length,
      필터링후: filtered.length,
      최종결과: sortedAndGrouped.length,
      매칭관점: matchingPerspective,
      검색어: searchTerm
    });

    setFilteredMatches(sortedAndGrouped);
  }, [matches, selectedIndustry, scoreRange, sortBy, sortOrder, matchingPerspective, searchTerm]);

  const fetchData = async () => {
    try {
      // 공급기업 데이터를 별도로 가져온 후 회원관리 정보와 매칭
      const [suppliersResponse, demandsResponse, membersResponse] = await Promise.all([
        supabase.from('공급기업').select('*'),
        supabase.from('수요기관').select('*'),
        supabase.from('회원관리').select('*')
      ]);

      console.log('데이터 로드 결과:', {
        suppliers: suppliersResponse.data?.length || 0,
        demands: demandsResponse.data?.length || 0,
        members: membersResponse.data?.length || 0,
        suppliersData: suppliersResponse.data?.slice(0, 2),
        demandsData: demandsResponse.data?.slice(0, 2),
        membersData: membersResponse.data?.slice(0, 2)
      });

      if (suppliersResponse.error || demandsResponse.error || membersResponse.error) {
        console.error('데이터 로드 오류:', {
          suppliersError: suppliersResponse.error,
          demandsError: demandsResponse.error,
          membersError: membersResponse.error
        });
        toast({
          title: "데이터 로드 실패",
          description: "데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        // 회원관리 데이터를 맵으로 변환
        const membersMap = new Map();
        (membersResponse.data || []).forEach(member => {
          membersMap.set(member.아이디, member);
        });

        // 공급기업 데이터에 회원관리 정보 매칭
        const transformedSuppliers = (suppliersResponse.data || []).map(supplier => {
          const memberInfo = membersMap.get(supplier.아이디);
          return {
            ...supplier,
            이메일: memberInfo?.이메일 || supplier.이메일,
            연락처: memberInfo?.연락처 || supplier.연락처,
            사용자명: memberInfo?.이름 || supplier.사용자명
          };
        });

        console.log('변환된 공급기업 데이터 샘플:', transformedSuppliers.slice(0, 2));

        setSuppliers(transformedSuppliers);
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
    
    setTimeout(() => {
      const newMatches: DetailedMatch[] = [];
      
      demands.forEach(demand => {
        suppliers.forEach(supplier => {
          const match = calculateMatchingScore(demand, supplier);
          
          // 20점 이상일 때만 매칭 결과에 포함
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

      // 점수 순으로 정렬하고 상위 100개 표시
      const sortedMatches = newMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 100);

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
    setMatchingPerspective("demand");
    setSearchTerm("");
  };

  const hasActiveFilters = selectedIndustry !== "all" || 
    scoreRange[0] !== 0 || scoreRange[1] !== 100 ||
    matchingPerspective !== "demand" ||
    searchTerm.trim() !== "";

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
    matchingPerspective,
    setMatchingPerspective,
    searchTerm,
    setSearchTerm,
    calculateMatches,
    clearFilters,
    hasActiveFilters,
    industries
  };
};
