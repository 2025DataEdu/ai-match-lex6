
import { Supplier, Demand, DetailedMatch } from "@/types/matching";
import { calculateKeywordSimilarity } from "./keywordSimilarity";
import { calculateServiceTypeScore } from "./serviceTypeMatching";

// 개별 매칭 점수 계산 (개선된 알고리즘)
export const calculateEnhancedMatchingScore = (demand: Demand, supplier: Supplier): DetailedMatch => {
  const demandKeywords = demand.추출키워드 || "";
  const supplierKeywords = supplier.추출키워드 || "";
  const demandContent = demand.수요내용 || "";
  
  // 1. 키워드 기반 매칭 (70% 비중) - 정확한 매칭에 높은 점수
  const keywordResult = calculateKeywordSimilarity(demandKeywords, supplierKeywords);
  const keywordScore = keywordResult.score * 0.7;
  
  // 2. AI 서비스 유형 매칭 (30% 비중) - 매칭된 서비스 유형 정보 포함
  const serviceTypeResult = calculateServiceTypeScore(
    demandContent, 
    supplier.유형 || "", 
    demandKeywords, 
    supplierKeywords
  );
  const serviceTypeScore = serviceTypeResult.score * 0.3;
  
  // 개선된 보너스 점수: 키워드와 서비스 유형이 모두 매칭되는 경우
  let bonusScore = 0;
  if (keywordResult.matchedKeywords.length > 0 && serviceTypeResult.matchedServiceTypes.length > 0) {
    // 키워드 매칭 수에 따른 보너스 (최대 15점)
    const keywordBonus = Math.min(keywordResult.matchedKeywords.length * 5, 15);
    // 서비스 유형 매칭 수에 따른 보너스 (최대 10점)
    const serviceTypeBonus = Math.min(serviceTypeResult.matchedServiceTypes.length * 5, 10);
    bonusScore = keywordBonus + serviceTypeBonus;
  }
  
  // 총 매칭 점수 계산
  const totalScore = keywordScore + serviceTypeScore + bonusScore;
  const matchScore = Math.round(Math.max(totalScore, 0));
  
  // 매칭 이유 생성 - 구체적인 매칭 정보 포함
  const reasons = [];
  if (keywordResult.matchedKeywords.length > 0) {
    reasons.push(`키워드 매칭: ${keywordResult.matchedKeywords.join(', ')} (${keywordScore.toFixed(1)}점)`);
  }
  if (serviceTypeResult.matchedServiceTypes.length > 0) {
    reasons.push(`서비스유형 매칭: ${serviceTypeResult.matchedServiceTypes.join(', ')} (${serviceTypeScore.toFixed(1)}점)`);
  }
  if (bonusScore > 0) {
    reasons.push(`매칭 보너스 (${bonusScore}점)`);
  }
  
  const matchReason = reasons.length > 0 ? reasons.join(' | ') : '기본 매칭';
  
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
    matchedKeywords: keywordResult.matchedKeywords,
    keywordScore: keywordScore,
    capabilityScore: serviceTypeScore,
    matchScore: matchScore,
    matchReason: matchReason,
    supplier: supplier,
    demand: demand,
    // 새로운 필드 추가
    matchedServiceTypes: serviceTypeResult.matchedServiceTypes,
    serviceTypeScore: serviceTypeScore,
    bonusScore: bonusScore
  };
};
