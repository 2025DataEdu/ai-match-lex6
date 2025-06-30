
import { useState, useEffect } from "react";

interface Demand {
  수요기관일련번호: string;
  수요기관: string;
  부서명: string;
  사용자명: string;
  유형: string;
  수요내용: string;
  금액: number;
  시작일: string;
  종료일: string;
  기타요구사항: string;
  등록일자: string;
}

interface FilterOptions {
  searchTerm: string;
  demandType: string;
  minBudget: string;
  maxBudget: string;
  organization: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const useDemandFilters = (demands: Demand[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    demandType: "all",
    minBudget: "",
    maxBudget: "",
    organization: "",
    sortBy: "수요기관",
    sortOrder: "desc"
  });

  const [filteredDemands, setFilteredDemands] = useState<Demand[]>([]);

  useEffect(() => {
    let filtered = demands;

    // 검색어 필터 (기관명을 우선으로 검색)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(demand =>
        demand.수요기관?.toLowerCase().includes(searchLower) ||
        demand.수요내용?.toLowerCase().includes(searchLower) ||
        demand.유형?.toLowerCase().includes(searchLower) ||
        demand.부서명?.toLowerCase().includes(searchLower) ||
        demand.사용자명?.toLowerCase().includes(searchLower) ||
        demand.기타요구사항?.toLowerCase().includes(searchLower)
      );
    }

    // 기관명 필터
    if (filters.organization) {
      const orgLower = filters.organization.toLowerCase();
      filtered = filtered.filter(demand =>
        demand.수요기관?.toLowerCase().includes(orgLower)
      );
    }

    // 예산 필터
    if (filters.minBudget || filters.maxBudget) {
      filtered = filtered.filter(demand => {
        const budget = demand.금액 || 0;
        const min = filters.minBudget ? parseInt(filters.minBudget) : 0;
        const max = filters.maxBudget ? parseInt(filters.maxBudget) : Infinity;
        return budget >= min && budget <= max;
      });
    }

    // 정렬 적용
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case "수요기관":
          aValue = a.수요기관 || "";
          bValue = b.수요기관 || "";
          break;
        case "금액":
          aValue = a.금액 || 0;
          bValue = b.금액 || 0;
          break;
        case "등록일자":
          aValue = new Date(a.등록일자 || "").getTime() || 0;
          bValue = new Date(b.등록일자 || "").getTime() || 0;
          break;
        case "유형":
          aValue = a.유형 || "";
          bValue = b.유형 || "";
          break;
        case "시작일":
          aValue = new Date(a.시작일 || "").getTime() || 0;
          bValue = new Date(b.시작일 || "").getTime() || 0;
          break;
        default:
          aValue = a.등록일자 || "";
          bValue = b.등록일자 || "";
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredDemands(filtered);
  }, [filters, demands]);

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      demandType: "all",
      minBudget: "",
      maxBudget: "",
      organization: "",
      sortBy: "수요기관",
      sortOrder: "desc"
    });
  };

  return {
    filters,
    setFilters,
    filteredDemands,
    clearFilters
  };
};
