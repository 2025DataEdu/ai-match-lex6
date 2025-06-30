
import { useState, useEffect } from "react";
import { DetailedMatch } from "@/types/matching";
import { groupAndSortMatches } from "@/utils/matchingAlgorithm";

export const useMatchingFilters = (matches: DetailedMatch[], suppliers: any[]) => {
  const [filteredMatches, setFilteredMatches] = useState<DetailedMatch[]>([]);
  
  // 필터 상태
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [matchingPerspective, setMatchingPerspective] = useState<'demand' | 'supplier'>('demand');
  const [searchTerm, setSearchTerm] = useState("");

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
    filteredMatches,
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
    clearFilters,
    hasActiveFilters,
    industries
  };
};
