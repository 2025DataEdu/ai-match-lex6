
import { Supplier, Demand } from "@/types/matching";

export interface DetailedMatch {
  supplier: Supplier;
  demand: Demand;
  matchScore: number;
  keywordScore: number;
  capabilityScore: number;
  budgetScore: number;
  matchedKeywords: string[];
  matchReason: string;
}

// 한글 키워드 사전
const KOREAN_KEYWORDS = [
  'AI', '인공지능', '머신러닝', '딥러닝', 'IoT', '사물인터넷',
  '스마트시티', '스마트팩토리', '빅데이터', '데이터분석',
  '앱개발', '웹개발', '모바일', '소프트웨어', '시스템개발',
  '교육', '이러닝', '게임', 'VR', 'AR', '가상현실', '증강현실',
  '핀테크', '블록체인', '보안', '클라우드', '네트워크',
  '의료', '헬스케어', '바이오', '환경', '에너지',
  '로봇', '자동화', '제조', '물류', '유통'
];

// 키워드 추출 함수
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const normalizedText = text.toLowerCase();
  const foundKeywords = KOREAN_KEYWORDS.filter(keyword => 
    normalizedText.includes(keyword.toLowerCase()) ||
    normalizedText.includes(keyword)
  );
  
  // 추가 키워드 추출 (공백으로 분리된 단어 중 3글자 이상)
  const words = text.split(/\s+/).filter(word => 
    word.length >= 3 && !/^\d+$/.test(word)
  );
  
  return [...new Set([...foundKeywords, ...words])];
}

// 자카드 유사도 계산
export function calculateJaccardSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 && keywords2.length === 0) return 1;
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1.map(k => k.toLowerCase()));
  const set2 = new Set(keywords2.map(k => k.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// 키워드 유사도 계산
export function calculateKeywordSimilarity(demandText: string, supplierText: string): {
  score: number;
  matchedKeywords: string[];
} {
  const demandKeywords = extractKeywords(demandText);
  const supplierKeywords = extractKeywords(supplierText);
  
  const matchedKeywords = demandKeywords.filter(keyword =>
    supplierKeywords.some(sk => 
      sk.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(sk.toLowerCase())
    )
  );
  
  const score = calculateJaccardSimilarity(demandKeywords, supplierKeywords);
  
  return {
    score: Math.min(score * 100, 100),
    matchedKeywords: matchedKeywords.slice(0, 5)
  };
}

// 기업 역량 점수 계산
export function calculateCapabilityScore(supplier: Supplier): number {
  let score = 50; // 기본 점수
  
  // 보유 특허가 있으면 가점
  if (supplier.보유특허 && supplier.보유특허.length > 10) {
    score += 20;
  }
  
  // 홈페이지가 있으면 가점 (신뢰도)
  if (supplier.기업홈페이지) {
    score += 10;
  }
  
  // 유튜브 링크가 있으면 가점 (마케팅 역량)
  if (supplier.유튜브링크) {
    score += 10;
  }
  
  // 세부설명이 상세할수록 가점
  if (supplier.세부설명 && supplier.세부설명.length > 100) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

// 예산 적합성 점수 계산
export function calculateBudgetScore(demandBudget: number, supplierType: string): number {
  if (!demandBudget) return 70; // 예산 미지정시 중간 점수
  
  // 공급기업 유형별 예산 구간 설정
  const budgetRanges: { [key: string]: { min: number; max: number } } = {
    '소프트웨어개발': { min: 1000, max: 10000 },
    'AI솔루션': { min: 2000, max: 20000 },
    '시스템구축': { min: 5000, max: 50000 },
    '컨설팅': { min: 500, max: 5000 },
    '교육서비스': { min: 300, max: 3000 }
  };
  
  const range = budgetRanges[supplierType] || { min: 1000, max: 10000 };
  
  if (demandBudget >= range.min && demandBudget <= range.max) {
    return 100;
  } else if (demandBudget < range.min) {
    return Math.max(30, 100 - ((range.min - demandBudget) / range.min) * 70);
  } else {
    return Math.max(50, 100 - ((demandBudget - range.max) / range.max) * 50);
  }
}

// 종합 매칭 점수 계산
export function calculateMatchingScore(demand: Demand, supplier: Supplier): DetailedMatch {
  const keywordResult = calculateKeywordSimilarity(
    demand.수요내용,
    `${supplier.세부설명} ${supplier.업종} ${supplier.유형}`
  );
  
  const capabilityScore = calculateCapabilityScore(supplier);
  const budgetScore = calculateBudgetScore(demand.금액, supplier.유형);
  
  // 가중 평균 계산 (키워드 60%, 역량 30%, 예산 10%)
  const totalScore = (keywordResult.score * 0.6) + (capabilityScore * 0.3) + (budgetScore * 0.1);
  
  // 매칭 이유 생성
  const reasons = [];
  if (keywordResult.matchedKeywords.length > 0) {
    reasons.push(`키워드 매칭 (${keywordResult.matchedKeywords.slice(0, 3).join(', ')})`);
  }
  if (capabilityScore > 70) {
    reasons.push('우수한 기업 역량');
  }
  if (budgetScore > 80) {
    reasons.push('예산 범위 적합');
  }
  if (supplier.유형 === demand.유형) {
    reasons.push('서비스 유형 일치');
  }
  
  return {
    supplier,
    demand,
    matchScore: Math.round(totalScore),
    keywordScore: Math.round(keywordResult.score),
    capabilityScore: Math.round(capabilityScore),
    budgetScore: Math.round(budgetScore),
    matchedKeywords: keywordResult.matchedKeywords,
    matchReason: reasons.length > 0 ? reasons.join(', ') : '기본 매칭'
  };
}
