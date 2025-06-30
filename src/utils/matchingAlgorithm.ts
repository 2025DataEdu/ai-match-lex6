
import { Supplier, Demand, DetailedMatch } from "@/types/matching";

// AI 서비스 유형별 키워드 매핑
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

// 공통 기술 키워드
const COMMON_TECH_KEYWORDS = [
  "ai", "인공지능", "머신러닝", "딥러닝", "빅데이터", "클라우드", "iot", "블록체인",
  "소프트웨어", "시스템", "플랫폼", "솔루션", "서비스", "개발", "구축", "운영",
  "분석", "진단", "예측", "관리", "모니터링", "최적화", "자동화", "효율화"
];

// 텍스트에서 키워드 추출 함수
const extractKeywords = (text: string): string[] => {
  if (!text) return [];
  
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = cleanText.split(' ').filter(word => word.length > 1);
  const keywords = new Set<string>();
  
  // 단어별로 키워드 추출
  words.forEach(word => {
    keywords.add(word);
    
    // 부분 매칭도 고려
    if (word.length > 3) {
      for (let i = 0; i <= word.length - 3; i++) {
        const substring = word.substring(i, i + 3);
        if (substring.length === 3) {
          keywords.add(substring);
        }
      }
    }
  });
  
  return Array.from(keywords);
};

// 키워드 유사도 계산
const calculateKeywordSimilarity = (keywords1: string[], keywords2: string[]): number => {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  let matchCount = 0;
  const totalKeywords = Math.max(keywords1.length, keywords2.length);
  
  keywords1.forEach(keyword1 => {
    keywords2.forEach(keyword2 => {
      // 완전 일치
      if (keyword1 === keyword2) {
        matchCount += 1;
      }
      // 부분 일치 (3글자 이상)
      else if (keyword1.length >= 3 && keyword2.length >= 3) {
        if (keyword1.includes(keyword2) || keyword2.includes(keyword1)) {
          matchCount += 0.7;
        }
      }
    });
  });
  
  return Math.min((matchCount / totalKeywords) * 100, 100);
};

// AI 서비스 유형 매칭 점수
const calculateServiceTypeScore = (demandContent: string, supplierType: string): number => {
  if (!demandContent || !supplierType) return 0;
  
  const serviceKeywords = AI_SERVICE_KEYWORDS[supplierType] || [];
  if (serviceKeywords.length === 0) return 0;
  
  const demandKeywords = extractKeywords(demandContent);
  let matchScore = 0;
  
  serviceKeywords.forEach(serviceKeyword => {
    demandKeywords.forEach(demandKeyword => {
      if (demandKeyword.includes(serviceKeyword) || serviceKeyword.includes(demandKeyword)) {
        matchScore += 10;
      }
    });
  });
  
  return Math.min(matchScore, 50);
};

// 업종 매칭 점수
const calculateIndustryScore = (demandType: string, supplierIndustry: string): number => {
  if (!demandType || !supplierIndustry) return 0;
  
  const demandKeywords = extractKeywords(demandType);
  const industryKeywords = extractKeywords(supplierIndustry);
  
  return calculateKeywordSimilarity(demandKeywords, industryKeywords) * 0.3;
};

export const calculateMatchingScore = (demand: Demand, supplier: Supplier): DetailedMatch => {
  // 키워드 추출
  const demandKeywords = extractKeywords(demand.수요내용 || "");
  const supplierKeywords = extractKeywords(supplier.세부설명 || "");
  
  // 추가 키워드 (기업명, 업종 등)
  const supplierAllKeywords = [
    ...supplierKeywords,
    ...extractKeywords(supplier.기업명 || ""),
    ...extractKeywords(supplier.업종 || ""),
    ...extractKeywords(supplier.유형 || "")
  ];
  
  const demandAllKeywords = [
    ...demandKeywords,
    ...extractKeywords(demand.수요기관 || ""),
    ...extractKeywords(demand.유형 || "")
  ];
  
  // 1. 핵심 키워드 매칭 점수 (40점)
  const keywordScore = calculateKeywordSimilarity(demandKeywords, supplierKeywords);
  
  // 2. AI 서비스 유형 매칭 점수 (30점)
  const serviceTypeScore = calculateServiceTypeScore(demand.수요내용 || "", supplier.유형 || "");
  
  // 3. 업종 매칭 점수 (20점)
  const industryScore = calculateIndustryScore(demand.유형 || "", supplier.업종 || "");
  
  // 4. 전체 키워드 매칭 점수 (10점)
  const overallKeywordScore = calculateKeywordSimilarity(demandAllKeywords, supplierAllKeywords) * 0.1;
  
  // 총 매칭 점수 계산
  const totalScore = (keywordScore * 0.4) + (serviceTypeScore * 0.3) + (industryScore * 0.2) + (overallKeywordScore * 0.1);
  const matchScore = Math.round(Math.max(totalScore, 0));
  
  // 매칭된 키워드 찾기
  const matchedKeywords: string[] = [];
  demandKeywords.forEach(dKeyword => {
    supplierKeywords.forEach(sKeyword => {
      if (dKeyword === sKeyword || 
          (dKeyword.length >= 3 && sKeyword.length >= 3 && 
           (dKeyword.includes(sKeyword) || sKeyword.includes(dKeyword)))) {
        if (!matchedKeywords.includes(dKeyword)) {
          matchedKeywords.push(dKeyword);
        }
      }
    });
  });
  
  // 매칭 이유 생성
  const matchReason = `키워드 매칭: ${keywordScore.toFixed(1)}점, 서비스 유형: ${serviceTypeScore.toFixed(1)}점, 업종: ${industryScore.toFixed(1)}점`;
  
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

export const calculateMatching = (demands: Demand[], suppliers: Supplier[]): DetailedMatch[] => {
  const matches: DetailedMatch[] = [];
  
  console.log('매칭 계산 시작:', { demands: demands.length, suppliers: suppliers.length });

  demands.forEach(demand => {
    suppliers.forEach(supplier => {
      const match = calculateMatchingScore(demand, supplier);
      matches.push(match);
    });
  });

  console.log('전체 매칭 결과:', matches.length);
  console.log('점수 분포:', {
    over50: matches.filter(m => m.matchScore >= 50).length,
    over30: matches.filter(m => m.matchScore >= 30).length,
    over10: matches.filter(m => m.matchScore >= 10).length,
    over0: matches.filter(m => m.matchScore > 0).length
  });

  return matches;
};

export const groupAndSortMatches = (
  matches: DetailedMatch[], 
  perspective: 'demand' | 'supplier' = 'demand',
  sortBy: string = 'matchScore', 
  sortOrder: 'asc' | 'desc' = 'desc'
) => {
  const sortedMatches = [...matches].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'matchScore':
      case 'score':
        compareValue = a.matchScore - b.matchScore;
        break;
      case 'company':
        compareValue = a.supplier.기업명.localeCompare(b.supplier.기업명);
        break;
      case 'date':
        compareValue = new Date(a.supplier.등록일자).getTime() - new Date(b.supplier.등록일자).getTime();
        break;
      default:
        compareValue = a.matchScore - b.matchScore;
    }
    
    return sortOrder === 'desc' ? -compareValue : compareValue;
  });
  
  return sortedMatches;
};
