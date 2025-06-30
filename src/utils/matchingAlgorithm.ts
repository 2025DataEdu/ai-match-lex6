
import { Supplier, Demand } from "@/types/matching";

// AI 서비스 유형별 확장된 키워드 사전
const AI_SERVICE_KEYWORDS = {
  "AI 챗봇/대화형AI": [
    "챗봇", "대화형", "대화", "AI", "자동응답", "고객상담", "음성인식", "자연어", "NLP", 
    "conversation", "chatbot", "virtual assistant", "conversational", "dialogue"
  ],
  "컴퓨터 비전/이미지AI": [
    "비전", "이미지", "영상", "컴퓨터비전", "이미지인식", "패턴인식", "객체인식", "얼굴인식", 
    "OCR", "vision", "image", "computer vision", "object detection", "facial recognition"
  ],
  "자연어처리/텍스트AI": [
    "자연어", "텍스트", "언어처리", "NLP", "번역", "텍스트분석", "감정분석", "요약", 
    "텍스트마이닝", "natural language", "text", "translation", "sentiment", "summarization"
  ],
  "음성인식/음성AI": [
    "음성", "음향", "STT", "TTS", "음성인식", "음성합성", "음성분석", "보이스", 
    "speech", "voice", "audio", "speech recognition", "voice synthesis"
  ],
  "예측분석/데이터AI": [
    "예측", "분석", "데이터", "머신러닝", "딥러닝", "통계", "예측모델", "빅데이터", 
    "analytics", "prediction", "machine learning", "deep learning", "statistics", "forecasting"
  ],
  "추천시스템/개인화AI": [
    "추천", "개인화", "맞춤", "협업필터링", "콘텐츠기반", "추천알고리즘", 
    "recommendation", "personalization", "collaborative filtering", "content based", "customization"
  ],
  "로봇/자동화AI": [
    "로봇", "자동화", "RPA", "지능형로봇", "산업로봇", "서비스로봇", "자동화시스템", 
    "robot", "automation", "robotic", "intelligent robot", "industrial robot"
  ],
  "AI 플랫폼/인프라": [
    "플랫폼", "인프라", "클라우드", "MLOps", "AI플랫폼", "인프라구축", "시스템구축", 
    "platform", "infrastructure", "cloud", "AI platform", "system integration"
  ],
  "AI 교육/컨설팅": [
    "교육", "컨설팅", "자문", "교육과정", "워크샵", "세미나", "AI교육", "기술자문", 
    "education", "consulting", "training", "workshop", "seminar", "advisory"
  ],
  "기타 AI 서비스": [
    "기타", "혼합", "복합", "통합", "다양한", "기타서비스", 
    "other", "mixed", "integrated", "various", "miscellaneous"
  ]
};

// 업종별 키워드 사전도 확장
const INDUSTRY_KEYWORDS = {
  "제조업": ["제조", "생산", "공장", "manufacturing", "production", "factory"],
  "정보통신업": ["IT", "소프트웨어", "통신", "정보통신", "software", "telecommunication"],
  "금융업": ["금융", "은행", "보험", "증권", "finance", "banking", "insurance"],
  "유통업": ["유통", "물류", "배송", "retail", "distribution", "logistics"],
  "의료업": ["의료", "병원", "헬스케어", "medical", "healthcare", "hospital"],
  "교육업": ["교육", "학교", "대학", "education", "school", "university"],
  "건설업": ["건설", "건축", "토목", "construction", "architecture"],
  "운송업": ["운송", "교통", "물류", "transportation", "traffic", "delivery"],
  "농업": ["농업", "농장", "agriculture", "farming"],
  "서비스업": ["서비스", "고객서비스", "service", "customer service"],
  "연구개발업": ["연구", "개발", "R&D", "research", "development"],
  "컨설팅업": ["컨설팅", "자문", "consulting", "advisory"],
  "기타": ["기타", "other", "miscellaneous"]
};

export interface DetailedMatch {
  demand: Demand;
  supplier: Supplier;
  matchScore: number;
  matchDetails: {
    typeMatch: number;
    keywordMatch: number;
    companyCapability: number;
    details: string[];
  };
}

// 키워드 매칭 점수 계산 (개선된 알고리즘)
function calculateKeywordMatch(demandContent: string, supplierDescription: string, demandType: string, supplierType: string): number {
  if (!demandContent || !supplierDescription) return 0;
  
  const demandLower = demandContent.toLowerCase();
  const supplierLower = supplierDescription.toLowerCase();
  
  // 유형별 특화 키워드 점수
  let typeKeywordScore = 0;
  const demandTypeKeywords = AI_SERVICE_KEYWORDS[demandType as keyof typeof AI_SERVICE_KEYWORDS] || [];
  const supplierTypeKeywords = AI_SERVICE_KEYWORDS[supplierType as keyof typeof AI_SERVICE_KEYWORDS] || [];
  
  // 수요 유형 키워드가 공급업체 설명에 포함되는지 확인
  const demandKeywordsInSupplier = demandTypeKeywords.filter(keyword => 
    supplierLower.includes(keyword.toLowerCase())
  ).length;
  
  // 공급업체 유형 키워드가 수요 내용에 포함되는지 확인
  const supplierKeywordsInDemand = supplierTypeKeywords.filter(keyword => 
    demandLower.includes(keyword.toLowerCase())
  ).length;
  
  typeKeywordScore = ((demandKeywordsInSupplier + supplierKeywordsInDemand) / 
    (demandTypeKeywords.length + supplierTypeKeywords.length)) * 100;
  
  // 일반적인 키워드 매칭 점수
  const commonKeywords = ["AI", "인공지능", "artificial intelligence", "기술", "서비스", "솔루션", "시스템"];
  const commonMatches = commonKeywords.filter(keyword => 
    demandLower.includes(keyword.toLowerCase()) && supplierLower.includes(keyword.toLowerCase())
  ).length;
  
  const commonScore = (commonMatches / commonKeywords.length) * 20; // 최대 20점
  
  return Math.min(typeKeywordScore + commonScore, 100);
}

// 기업 역량 점수 계산
function calculateCompanyCapability(supplier: Supplier): number {
  let score = 50; // 기본 점수
  
  // 보유특허가 있으면 가점
  if (supplier.보유특허 && supplier.보유특허.trim().length > 10) {
    score += 20;
  }
  
  // 기업홈페이지가 있으면 가점
  if (supplier.기업홈페이지 && supplier.기업홈페이지.trim().length > 0) {
    score += 10;
  }
  
  // 유튜브링크가 있으면 가점
  if (supplier.유튜브링크 && supplier.유튜브링크.trim().length > 0) {
    score += 10;
  }
  
  // 세부설명이 충실하면 가점
  if (supplier.세부설명 && supplier.세부설명.trim().length > 50) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

// 유형 일치 점수 계산
function calculateTypeMatch(demandType: string, supplierType: string): number {
  if (demandType === supplierType) return 100;
  
  // 유사한 유형들에 대한 부분 점수
  const similarTypes = {
    "AI 챗봇/대화형AI": ["자연어처리/텍스트AI", "음성인식/음성AI"],
    "컴퓨터 비전/이미지AI": ["로봇/자동화AI"],
    "자연어처리/텍스트AI": ["AI 챗봇/대화형AI", "음성인식/음성AI"],
    "음성인식/음성AI": ["AI 챗봇/대화형AI", "자연어처리/텍스트AI"],
    "예측분석/데이터AI": ["추천시스템/개인화AI"],
    "추천시스템/개인화AI": ["예측분석/데이터AI"],
    "로봇/자동화AI": ["컴퓨터 비전/이미지AI"],
    "AI 플랫폼/인프라": ["AI 교육/컨설팅"],
    "AI 교육/컨설팅": ["AI 플랫폼/인프라"]
  };
  
  const similar = similarTypes[demandType as keyof typeof similarTypes] || [];
  if (similar.includes(supplierType)) return 60;
  
  return 20; // 기본적으로 모든 AI 서비스는 어느 정도 관련성이 있음
}

export function calculateMatchingScore(demand: Demand, supplier: Supplier): DetailedMatch {
  // 각 항목별 점수 계산
  const typeMatch = calculateTypeMatch(demand.유형 || "", supplier.유형 || "");
  
  const keywordMatch = calculateKeywordMatch(
    demand.수요내용 || "", 
    supplier.세부설명 || "", 
    demand.유형 || "", 
    supplier.유형 || ""
  );
  
  const companyCapability = calculateCompanyCapability(supplier);
  
  // 가중 평균으로 최종 점수 계산 (키워드 50%, 기업역량 30%, 유형일치 20%)
  const finalScore = Math.round(
    (keywordMatch * 0.5) + 
    (companyCapability * 0.3) + 
    (typeMatch * 0.2)
  );
  
  // 세부 정보 생성
  const details: string[] = [];
  if (typeMatch === 100) {
    details.push("서비스 유형이 정확히 일치");
  } else if (typeMatch >= 60) {
    details.push("서비스 유형이 유사함");
  }
  
  if (keywordMatch >= 70) {
    details.push("키워드 매칭도가 높음");
  } else if (keywordMatch >= 40) {
    details.push("키워드 매칭도가 보통");
  }
  
  if (companyCapability >= 80) {
    details.push("기업 역량이 우수함");
  } else if (companyCapability >= 60) {
    details.push("기업 역량이 양호함");
  }
  
  if (supplier.보유특허 && supplier.보유특허.trim().length > 10) {
    details.push("관련 특허 보유");
  }
  
  return {
    demand,
    supplier,
    matchScore: finalScore,
    matchDetails: {
      typeMatch,
      keywordMatch: Math.round(keywordMatch),
      companyCapability: Math.round(companyCapability),
      details
    }
  };
}
