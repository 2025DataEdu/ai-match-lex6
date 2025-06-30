
import { Supplier, Demand, DetailedMatch } from "@/types/matching";

// 키워드 유사도 계산 (개선된 버전)
const calculateKeywordSimilarity = (keywords1: string, keywords2: string): number => {
  if (!keywords1 || !keywords2) return 0;
  
  const keywordArray1 = keywords1.toLowerCase().split(',').map(k => k.trim());
  const keywordArray2 = keywords2.toLowerCase().split(',').map(k => k.trim());
  
  let matchScore = 0;
  
  keywordArray1.forEach(keyword1 => {
    keywordArray2.forEach(keyword2 => {
      // 완전 일치
      if (keyword1 === keyword2) {
        matchScore += 10;
      }
      // 부분 일치 (3글자 이상)
      else if (keyword1.length >= 3 && keyword2.length >= 3) {
        if (keyword1.includes(keyword2) || keyword2.includes(keyword1)) {
          matchScore += 7;
        }
        // 유사한 키워드 (2글자 이상 공통)
        else if (hasSimilarSubstring(keyword1, keyword2)) {
          matchScore += 3;
        }
      }
    });
  });
  
  return Math.min(matchScore, 100);
};

// 유사한 부분 문자열 검사
const hasSimilarSubstring = (str1: string, str2: string): boolean => {
  if (str1.length < 2 || str2.length < 2) return false;
  
  for (let i = 0; i <= str1.length - 2; i++) {
    const substring = str1.substring(i, i + 2);
    if (str2.includes(substring)) {
      return true;
    }
  }
  return false;
};

// AI 서비스 유형 매칭
const AI_SERVICE_KEYWORDS: { [key: string]: string[] } = {
  "AI 챗봇/대화형AI": ["챗봇", "대화형", "자연어", "응답", "상담", "문의", "bot", "chat", "대화", "자동응답"],
  "컴퓨터 비전/이미지AI": ["비전", "이미지", "인식", "분석", "영상", "시각", "카메라", "detection", "vision", "ocr"],
  "자연어처리/텍스트AI": ["자연어", "텍스트", "언어", "번역", "요약", "분석", "문서", "nlp", "text", "언어처리"],
  "음성인식/음성AI": ["음성", "voice", "speech", "stt", "tts", "인식", "합성", "발음", "소리"],
  "예측분석/데이터AI": ["예측", "분석", "데이터", "통계", "머신러닝", "learning", "예측모델", "빅데이터", "analytics"],
  "추천시스템/개인화AI": ["추천", "개인화", "맞춤", "추천시스템", "협업필터링", "개인화서비스", "recommendation"],
  "로봇/자동화AI": ["로봇", "자동화", "automation", "robot", "제어", "자동", "무인", "스마트팩토리"],
  "AI 플랫폼/인프라": ["플랫폼", "인프라", "클라우드", "서버", "gpu", "개발환경", "infrastructure"],
  "AI 교육/컨설팅": ["교육", "컨설팅", "워크숍", "교육과정", "consulting", "training", "학습"],
  "기타 AI 서비스": ["ai", "인공지능", "딥러닝", "머신러닝", "지능형", "스마트", "intelligent"]
};

const calculateServiceTypeScore = (demandContent: string, supplierType: string, demandKeywords: string, supplierKeywords: string): number => {
  const serviceKeywords = AI_SERVICE_KEYWORDS[supplierType] || [];
  if (serviceKeywords.length === 0) return 0;
  
  const allDemandText = `${demandContent} ${demandKeywords}`.toLowerCase();
  const allSupplierText = `${supplierType} ${supplierKeywords}`.toLowerCase();
  
  let matchScore = 0;
  
  serviceKeywords.forEach(serviceKeyword => {
    if (allDemandText.includes(serviceKeyword) && allSupplierText.includes(serviceKeyword)) {
      matchScore += 15;
    } else if (allDemandText.includes(serviceKeyword) || allSupplierText.includes(serviceKeyword)) {
      matchScore += 8;
    }
  });
  
  return Math.min(matchScore, 50);
};

// 업종 매칭 점수
const calculateIndustryScore = (demandType: string, supplierIndustry: string): number => {
  if (!demandType || !supplierIndustry) return 0;
  
  const demandLower = demandType.toLowerCase();
  const industryLower = supplierIndustry.toLowerCase();
  
  if (demandLower === industryLower) return 20;
  if (demandLower.includes(industryLower) || industryLower.includes(demandLower)) return 15;
  
  return 0;
};

export const calculateEnhancedMatchingScore = (demand: Demand, supplier: Supplier): DetailedMatch => {
  const demandKeywords = demand.추출키워드 || "";
  const supplierKeywords = supplier.추출키워드 || "";
  const demandContent = demand.수요내용 || "";
  
  // 1. 추출된 키워드 기반 매칭 (60점) - 가장 중요
  let keywordScore = 0;
  if (demandKeywords && supplierKeywords) {
    keywordScore = calculateKeywordSimilarity(demandKeywords, supplierKeywords) * 0.6;
  }
  
  // 2. AI 서비스 유형 매칭 (25점)
  const serviceTypeScore = calculateServiceTypeScore(
    demandContent, 
    supplier.유형 || "", 
    demandKeywords, 
    supplierKeywords
  ) * 0.5;
  
  // 3. 업종 매칭 (15점)
  const industryScore = calculateIndustryScore(demand.유형 || "", supplier.업종 || "") * 0.75;
  
  // 총 매칭 점수 계산 (텍스트 백업 제거)
  const totalScore = keywordScore + serviceTypeScore + industryScore;
  const matchScore = Math.round(Math.max(totalScore, 0));
  
  // 매칭된 키워드 분석
  const matchedKeywords: string[] = [];
  if (demandKeywords && supplierKeywords) {
    const demandArray = demandKeywords.toLowerCase().split(',').map(k => k.trim());
    const supplierArray = supplierKeywords.toLowerCase().split(',').map(k => k.trim());
    
    demandArray.forEach(dKeyword => {
      supplierArray.forEach(sKeyword => {
        if (dKeyword === sKeyword || 
            (dKeyword.length >= 3 && sKeyword.length >= 3 && 
             (dKeyword.includes(sKeyword) || sKeyword.includes(dKeyword)))) {
          if (!matchedKeywords.includes(dKeyword)) {
            matchedKeywords.push(dKeyword);
          }
        }
      });
    });
  }
  
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
    capabilityScore: totalScore,
    matchScore: matchScore,
    matchReason: matchReason,
    supplier: supplier,
    demand: demand
  };
};

export const calculateEnhancedMatching = (demands: Demand[], suppliers: Supplier[]): DetailedMatch[] => {
  const matches: DetailedMatch[] = [];
  
  console.log('개선된 키워드 기반 매칭 계산 시작:', { 
    demands: demands.length, 
    suppliers: suppliers.length,
    keywordExtractedSuppliers: suppliers.filter(s => s.추출키워드).length,
    keywordExtractedDemands: demands.filter(d => d.추출키워드).length
  });

  demands.forEach(demand => {
    suppliers.forEach(supplier => {
      const match = calculateEnhancedMatchingScore(demand, supplier);
      matches.push(match);
    });
  });

  const validMatches = matches.filter(m => m.matchScore > 0);
  
  console.log('개선된 매칭 결과:', {
    total: matches.length,
    withScore: validMatches.length,
    scoreDistribution: {
      over50: validMatches.filter(m => m.matchScore >= 50).length,
      over30: validMatches.filter(m => m.matchScore >= 30).length,
      over20: validMatches.filter(m => m.matchScore >= 20).length,
      over10: validMatches.filter(m => m.matchScore >= 10).length,
    }
  });

  return matches;
};
