
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
}

export const useDemandFilters = (demands: Demand[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    demandType: "",
    minBudget: "",
    maxBudget: "",
    organization: ""
  });

  const [filteredDemands, setFilteredDemands] = useState<Demand[]>([]);

  useEffect(() => {
    let filtered = demands;

    // 검색어 필터
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(demand =>
        demand.수요기관?.toLowerCase().includes(searchLower) ||
        demand.유형?.toLowerCase().includes(searchLower) ||
        demand.수요내용?.toLowerCase().includes(searchLower) ||
        demand.부서명?.toLowerCase().includes(searchLower)
      );
    }

    // 기관명 필터
    if (filters.organization) {
      const orgLower = filters.organization.toLowerCase();
      filtered = filtered.filter(demand =>
        demand.수요기관?.toLowerCase().includes(orgLower)
      );
    }

    // 수요 유형 필터
    if (filters.demandType) {
      filtered = filtered.filter(demand => demand.유형 === filters.demandType);
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

    setFilteredDemands(filtered);
  }, [filters, demands]);

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      demandType: "",
      minBudget: "",
      maxBudget: "",
      organization: ""
    });
  };

  return {
    filters,
    setFilters,
    filteredDemands,
    clearFilters
  };
};
