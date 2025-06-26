import { Supplier, Demand } from "@/types/matching";

export interface DetailedMatch {
  supplier: Supplier;
  demand: Demand;
  matchScore: number;
  keywordScore: number;
  capabilityScore: number;
  matchedKeywords: string[];
  matchReason: string;
}

export interface GroupedMatches {
  [key: string]: {
    entity: Supplier | Demand;
    matches: DetailedMatch[];
    averageScore: number;
    totalMatches: number;
  };
}

// 한글 키워드 사전
const KOREAN_KEYWORDS = [
  'AI', '인공지능', '머신러닝', '딥러닝', 'IoT', '사물인터넷',
  '스마트시티', '스마트팩토리', '빅데이터', '데이터분석',
  '앱개발', '웹개발', '모바일', '소프트웨어', '시스템개발',
  '교육', '이러닝', '게임', 'VR', 'AR', '가상현실', '증강현실',
  '핀테크', '블록체인', '보안', '클라우드', '네트워크',
  '의료', '헬스케어', '바이오', '환경', '에너지',
  '로봇', '자동화', '제조', '물류', '유통', '챗봇', '자연어처리'
];

// 키워드 추출 함수
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const normalizedText = text.toLowerCase();
  const foundKeywords = KOREAN_KEYWORDS.filter(keyword => 
    normalizedText.includes(keyword.toLowerCase()) ||
    normalizedText.includes(keyword)
  );
  
  // 추가 키워드 추출 (공백으로 분리된 단어 중 2글자 이상)
  const words = text.split(/\s+/).filter(word => 
    word.length >= 2 && !/^\d+$/.test(word) && !['은', '는', '이', '가', '을', '를', '의', '에', '로', '와', '과', '도', '만', '부터', '까지', '에서', '으로', '에게', '한테', '께', '에서부터'].includes(word)
  );
  
  return [...new Set([...foundKeywords, ...words])];
}

// 자카드 유사도 계산
export function calculateJaccardSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 && keywords2.length === 0) return 0;
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1.map(k => k.toLowerCase()));
  const set2 = new Set(keywords2.map(k => k.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
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
  
  const jaccardScore = calculateJaccardSimilarity(demandKeywords, supplierKeywords);
  
  // 직접 매칭 키워드가 있으면 가산점
  const directMatchBonus = matchedKeywords.length > 0 ? 0.2 : 0;
  const finalScore = Math.min((jaccardScore + directMatchBonus) * 100, 100);
  
  return {
    score: finalScore,
    matchedKeywords: matchedKeywords.slice(0, 5)
  };
}

// 기업 역량 점수 계산
export function calculateCapabilityScore(supplier: Supplier): number {
  let score = 30; // 기본 점수
  
  // 보유 특허가 있으면 가점
  if (supplier.보유특허 && supplier.보유특허.length > 10) {
    score += 25;
  }
  
  // 홈페이지가 있으면 가점 (신뢰도)
  if (supplier.기업홈페이지) {
    score += 20;
  }
  
  // 유튜브 링크가 있으면 가점 (마케팅 역량)
  if (supplier.유튜브링크) {
    score += 15;
  }
  
  // 세부설명이 상세할수록 가점
  if (supplier.세부설명 && supplier.세부설명.length > 100) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

// 종합 매칭 점수 계산
export function calculateMatchingScore(demand: Demand, supplier: Supplier): DetailedMatch {
  const keywordResult = calculateKeywordSimilarity(
    demand.수요내용 || '',
    `${supplier.세부설명 || ''} ${supplier.업종 || ''} ${supplier.유형 || ''}`
  );
  
  const capabilityScore = calculateCapabilityScore(supplier);
  
  // 가중 평균 계산 (키워드 70%, 역량 30%)
  const totalScore = (keywordResult.score * 0.7) + (capabilityScore * 0.3);
  
  // 매칭 이유 생성
  const reasons = [];
  if (keywordResult.matchedKeywords.length > 0) {
    reasons.push(`키워드 매칭 (${keywordResult.matchedKeywords.slice(0, 3).join(', ')})`);
  }
  if (capabilityScore > 70) {
    reasons.push('우수한 기업 역량');
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
    matchedKeywords: keywordResult.matchedKeywords,
    matchReason: reasons.length > 0 ? reasons.join(', ') : '기본 매칭'
  };
}

// 매칭 결과를 관점별로 그룹화하고 정렬
export function groupAndSortMatches(
  matches: DetailedMatch[], 
  perspective: 'demand' | 'supplier',
  sortBy: string = 'matchScore',
  sortOrder: 'asc' | 'desc' = 'desc'
): DetailedMatch[] {
  // 관점에 따라 그룹화
  const grouped: GroupedMatches = {};
  
  matches.forEach(match => {
    const key = perspective === 'demand' 
      ? match.demand.수요기관일련번호 
      : match.supplier.공급기업일련번호;
    
    if (!grouped[key]) {
      grouped[key] = {
        entity: perspective === 'demand' ? match.demand : match.supplier,
        matches: [],
        averageScore: 0,
        totalMatches: 0
      };
    }
    
    grouped[key].matches.push(match);
    grouped[key].totalMatches++;
  });
  
  // 각 그룹의 평균 점수 계산
  Object.values(grouped).forEach(group => {
    group.averageScore = group.matches.reduce((sum, match) => sum + match.matchScore, 0) / group.matches.length;
    
    // 그룹 내에서 매칭 점수로 정렬
    group.matches.sort((a, b) => b.matchScore - a.matchScore);
  });
  
  // 그룹을 평균 점수로 정렬
  const sortedGroups = Object.values(grouped).sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.averageScore - a.averageScore;
    } else {
      return a.averageScore - b.averageScore;
    }
  });
  
  // 정렬된 결과를 평면 배열로 변환
  const result: DetailedMatch[] = [];
  sortedGroups.forEach(group => {
    result.push(...group.matches);
  });
  
  return result;
}
