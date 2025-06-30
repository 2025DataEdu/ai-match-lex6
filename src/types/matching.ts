
export interface BaseMatch {
  id: string;
  companyName: string;
  type: string;
  industry: string;
  description: string;
  patents?: string;
  website?: string;
  youtubeLinks?: string;
  username: string;
  registrationDate: string;
  isInterested: boolean;
  hasInquiry: boolean;
}

export interface DetailedMatch extends BaseMatch {
  score: number;
  matchedKeywords: string[];
  keywordScore: number;
  capabilityScore: number;
  matchReason: string;
}

export interface MatchingData {
  demandId: string;
  demandTitle: string;
  demandType: string;
  demandIndustry: string;
  demandDescription: string;
  matches: DetailedMatch[];
  totalMatches: number;
}

export interface FilterOptions {
  selectedType: string;
  selectedIndustry: string;
  scoreRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface MatchingFiltersProps {
  aiServiceTypes: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  scoreRange: [number, number];
  onScoreRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface DemandFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  onReset: () => void;
}

export interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  onReset: () => void;
}
