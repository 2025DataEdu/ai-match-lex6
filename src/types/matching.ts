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
  matchScore: number;
  supplier: Supplier;
  demand: Demand;
}

export interface Match {
  supplier: Supplier;
  demand: Demand;
  matchScore: number;
  matchedKeywords: string[];
  keywordScore: number;
  capabilityScore: number;
  matchReason: string;
}

export interface Supplier {
  공급기업일련번호: string;
  기업명: string;
  유형: string;
  업종: string;
  세부설명: string;
  기업홈페이지?: string;
  유튜브링크?: string;
  보유특허?: string;
  사용자명?: string;
  등록일자?: string;
  아이디?: string;
  관심여부?: string;
  문의여부?: string;
  이메일?: string;
  연락처?: string;
  추출키워드?: string;
  키워드추출상태?: string;
}

export interface Demand {
  수요기관일련번호: string;
  수요기관: string;
  유형: string;
  수요내용: string;
  부서명?: string;
  사용자명?: string;
  시작일?: string;
  종료일?: string;
  금액?: number;
  기타요구사항?: string;
  등록일자?: string;
  아이디?: string;
  관심여부?: string;
  문의일자?: string;
  추출키워드?: string;
  키워드추출상태?: string;
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
  industries: string[];
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  scoreRange: [number, number];
  onScoreRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  matchingPerspective: 'demand' | 'supplier';
  onMatchingPerspectiveChange: (perspective: 'demand' | 'supplier') => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface DemandFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  onRefresh: () => Promise<void>;
}

export interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onRefresh: () => Promise<void>;
}
