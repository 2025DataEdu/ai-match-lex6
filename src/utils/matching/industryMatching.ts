
// 업종 매칭 유틸리티

// 업종 매칭 점수 계산
export const calculateIndustryScore = (demandType: string, supplierIndustry: string): number => {
  if (!demandType || !supplierIndustry) return 0;
  
  const demandLower = demandType.toLowerCase();
  const industryLower = supplierIndustry.toLowerCase();
  
  if (demandLower === industryLower) return 100;
  if (demandLower.includes(industryLower) || industryLower.includes(demandLower)) return 70;
  
  return 0;
};
