
import { useMatchingData } from "./useMatchingData";
import { useMatchingFilters } from "./useMatchingFilters";
import { useMatchingCalculation } from "./useMatchingCalculation";

export const useAIMatching = () => {
  const { suppliers, demands, isLoading, refetch } = useMatchingData();
  const { matches, isMatching, calculateMatches: performMatching } = useMatchingCalculation();
  const {
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
  } = useMatchingFilters(matches, suppliers);

  const calculateMatches = () => {
    performMatching(suppliers, demands);
  };

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
