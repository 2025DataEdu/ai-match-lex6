
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { calculateKeywordSimilarity, extractMatchedKeywords } from "./keywordSimilarity";
import { calculateServiceTypeScore } from "./serviceTypeMatching";
import { calculateIndustryScore } from "./industryMatching";

// 개별 매칭 점수 계산
export const calculateEnhancedMatchingScore = (demand: Demand, supplier: Supplier): DetailedMatch => {
  const demandKeywords = demand.추출키워드 || "";
  const supplierKeywords = supplier.추출키워드 || "";
  const demandContent = demand.수요내용 || "";
  
  // 1. 추출된 키워드 기반 매칭 (60% 비중)
  let keywordScore = 0;
  if (demandKeywords && supplierKeywords) {
    keywordScore = calculateKeywordSimilarity(demandKeywords, supplierKeywords) * 0.6;
  }
  
  // 2. AI 서비스 유형 매칭 (30% 비중)
  const serviceTypeScore = calculateServiceTypeScore(
    demandContent, 
    supplier.유형 || "", 
    demandKeywords, 
    supplierKeywords
  ) * 0.3;
  
  // 3. 업종 매칭 (10% 비중)
  const industryScore = calculateIndustryScore(demand.유형 || "", supplier.업종 || "") * 0.1;
  
  // 총 매칭 점수 계산
  const totalScore = keywordScore + serviceTypeScore + industryScore;
  const matchScore = Math.round(Math.max(totalScore, 0));
  
  // 매칭된 키워드 분석
  const matchedKeywords = extractMatchedKeywords(demandKeywords, supplierKeywords);
  
  // 매칭 이유 생성
  const reasons = [];
  if (keywordScore > 0) reasons.push(`키워드: ${keywordScore.toFixed(1)}점`);
  if (serviceTypeScore > 0) reasons.push(`서비스유형: ${serviceTypeScore.toFixed(1)}점`);
  if (industryScore > 0) reasons.push(`업종: ${industryScore.toFixed(1)}점`);
  
  const matchReason = reasons.length > 0 ? reasons.join(', ') : '기본 매칭';
  
  return {
    id: `${supplier.공급기업일련번호}_${demand.수요기관일련번호}`,
    companyName: supplier.기업명,
    type: supplier.유형,
    industry: supplier.업종,
    description: supplier.세부설명,
    patents: supplier.보유특허,
    website: supplier.기업홈페이지,
    youtubeLinks: supplier.유튜브링크,
    username: supplier.사용자명,
    registrationDate: supplier.등록일자,
    isInterested: supplier.관심여부 === 'Y',
    hasInquiry: supplier.문의여부 === 'Y',
    score: matchScore,
    matchedKeywords: matchedKeywords,
    keywordScore: keywordScore,
    capabilityScore: serviceTypeScore + industryScore,
    matchScore: matchScore,
    matchReason: matchReason,
    supplier: supplier,
    demand: demand
  };
};
