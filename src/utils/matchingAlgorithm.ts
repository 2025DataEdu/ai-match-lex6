
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

// 개선된 한글 키워드 사전 - 더 구체적이고 의미있는 키워드들
const KOREAN_KEYWORDS = [
  // AI/머신러닝 관련
  'AI', '인공지능', '머신러닝', '딥러닝', '자연어처리', 'NLP', '컴퓨터비전', '음성인식',
  'ChatGPT', 'GPT', '챗봇', '대화형AI', '생성형AI', '예측모델', '추천시스템',
  
  // 기술 분야
  'IoT', '사물인터넷', '빅데이터', '데이터분석', '데이터마이닝', '블록체인',
  '클라우드', 'AWS', 'Azure', 'GCP', '마이크로서비스', 'API', 'REST',
  
  // 개발 관련
  '앱개발', '웹개발', '모바일앱', '안드로이드', 'iOS', '웹사이트', '소프트웨어',
  '시스템개발', '플랫폼개발', 'UI/UX', '프론트엔드', '백엔드', '풀스택',
  
  // 산업별 특화
  '스마트시티', '스마트팩토리', '디지털트윈', '자동화', '로봇', 'RPA',
  '핀테크', '결제시스템', '전자상거래', 'e-커머스', '온라인쇼핑몰',
  
  // 교육/콘텐츠
  '교육', '이러닝', 'e-learning', '온라인교육', '원격교육', '교육플랫폼',
  '게임', '메타버스', 'VR', 'AR', '가상현실', '증강현실', '3D', '시뮬레이션',
  
  // 의료/헬스케어
  '의료', '헬스케어', '원격의료', '의료정보시스템', '병원관리', '진료',
  '바이오', '생명과학', '제약', '임상시험', '건강관리',
  
  // 보안/인프라
  '보안', '사이버보안', '정보보안', '네트워크보안', '암호화',
  '네트워크', '서버', '인프라', '데이터베이스', 'DB',
  
  // 기타 중요 키워드
  '환경', '에너지', '신재생에너지', '그린테크', 'ESG',
  '물류', '유통', '배송', '재고관리', 'SCM',
  '관리시스템', 'ERP', 'CRM', 'MES', 'WMS'
];

// 개선된 키워드 추출 함수
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const normalizedText = text.toLowerCase();
  const foundKeywords = new Set<string>();
  
  // 사전 키워드 매칭 (대소문자 구분 없이)
  KOREAN_KEYWORDS.forEach(keyword => {
    if (normalizedText.includes(keyword.toLowerCase())) {
      foundKeywords.add(keyword);
    }
  });
  
  // 의미있는 단어 추출 (2글자 이상, 불용어 제외)
  const stopWords = ['은', '는', '이', '가', '을', '를', '의', '에', '로', '와', '과', '도', '만', '부터', '까지', '에서', '으로', '에게', '한테', '께', '에서부터', '하는', '있는', '되는', '같은', '통해', '위한', '위해', '통한', '관련', '기반', '중심', '전용', '전문', '특화'];
  
  const words = text.split(/[\s,\.\!\?\(\)\[\]\{\}]+/)
    .filter(word => {
      const cleanWord = word.trim();
      return cleanWord.length >= 2 && 
             !/^\d+$/.test(cleanWord) && 
             !stopWords.includes(cleanWord) &&
             !/^[a-zA-Z]{1}$/.test(cleanWord); // 단일 영문자 제외
    });
  
  words.forEach(word => {
    if (word.length >= 2) {
      foundKeywords.add(word);
    }
  });
  
  return Array.from(foundKeywords);
}

// 개선된 키워드 유사도 계산
export function calculateKeywordSimilarity(demandText: string, supplierText: string): {
  score: number;
  matchedKeywords: string[];
} {
  const demandKeywords = extractKeywords(demandText);
  const supplierKeywords = extractKeywords(supplierText);
  
  if (demandKeywords.length === 0 || supplierKeywords.length === 0) {
    return { score: 0, matchedKeywords: [] };
  }
  
  const matchedKeywords = new Set<string>();
  let exactMatches = 0;
  let partialMatches = 0;
  
  // 정확한 매칭과 부분 매칭을 구분하여 계산
  demandKeywords.forEach(demandKeyword => {
    supplierKeywords.forEach(supplierKeyword => {
      const dKeyword = demandKeyword.toLowerCase();
      const sKeyword = supplierKeyword.toLowerCase();
      
      if (dKeyword === sKeyword) {
        exactMatches++;
        matchedKeywords.add(demandKeyword);
      } else if (dKeyword.includes(sKeyword) || sKeyword.includes(dKeyword)) {
        partialMatches++;
        matchedKeywords.add(demandKeyword);
      }
    });
  });
  
  // 가중치를 적용한 점수 계산
  const totalKeywords = Math.max(demandKeywords.length, supplierKeywords.length);
  const exactScore = (exactMatches / totalKeywords) * 100;
  const partialScore = (partialMatches / totalKeywords) * 50; // 부분 매칭은 50% 가중치
  
  const finalScore = Math.min(exactScore + partialScore, 100);
  
  return {
    score: finalScore,
    matchedKeywords: Array.from(matchedKeywords).slice(0, 5)
  };
}

// 개선된 기업 역량 점수 계산
export function calculateCapabilityScore(supplier: Supplier): number {
  let score = 20; // 기본 점수 낮춤 (더 엄격한 평가)
  
  // 세부설명의 질적 평가
  if (supplier.세부설명) {
    const descLength = supplier.세부설명.length;
    if (descLength > 200) score += 25; // 상세한 설명
    else if (descLength > 100) score += 15;
    else if (descLength > 50) score += 10;
    
    // 기술 키워드 포함 여부 확인
    const techKeywords = extractKeywords(supplier.세부설명);
    const techKeywordCount = techKeywords.filter(keyword => 
      KOREAN_KEYWORDS.includes(keyword)
    ).length;
    
    if (techKeywordCount >= 5) score += 20;
    else if (techKeywordCount >= 3) score += 15;
    else if (techKeywordCount >= 1) score += 10;
  }
  
  // 보유 특허 평가
  if (supplier.보유특허 && supplier.보유특허.length > 10) {
    score += 20;
  }
  
  // 온라인 존재감 평가
  if (supplier.기업홈페이지) {
    score += 15; // 신뢰도 지표
  }
  
  if (supplier.유튜브링크) {
    score += 10; // 마케팅 역량
  }
  
  // 업종과 유형의 일관성 평가
  if (supplier.업종 && supplier.유형) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

// 개선된 종합 매칭 점수 계산
export function calculateMatchingScore(demand: Demand, supplier: Supplier): DetailedMatch {
  // 키워드 매칭 (수요내용 vs 공급기업 정보)
  const keywordResult = calculateKeywordSimilarity(
    demand.수요내용 || '',
    `${supplier.세부설명 || ''} ${supplier.업종 || ''} ${supplier.유형 || ''}`
  );
  
  const capabilityScore = calculateCapabilityScore(supplier);
  
  // 유형 일치도 계산
  let typeMatchScore = 0;
  if (demand.유형 && supplier.유형) {
    if (demand.유형 === supplier.유형) {
      typeMatchScore = 30; // 유형 완전 일치 시 보너스
    } else {
      // 유사 유형 매칭 (예: '웹개발'과 '앱개발')
      const demandType = demand.유형.toLowerCase();
      const supplierType = supplier.유형.toLowerCase();
      if (demandType.includes('개발') && supplierType.includes('개발')) {
        typeMatchScore = 15;
      } else if (demandType.includes('시스템') && supplierType.includes('시스템')) {
        typeMatchScore = 15;
      }
    }
  }
  
  // 가중 평균 계산 (키워드 50%, 역량 30%, 유형매칭 20%)
  const totalScore = (keywordResult.score * 0.5) + (capabilityScore * 0.3) + (typeMatchScore * 0.2);
  
  // 매칭 이유 생성
  const reasons = [];
  if (keywordResult.matchedKeywords.length > 0) {
    reasons.push(`키워드 매칭 (${keywordResult.matchedKeywords.slice(0, 3).join(', ')})`);
  }
  if (capabilityScore > 70) {
    reasons.push('우수한 기업 역량');
  }
  if (typeMatchScore > 0) {
    reasons.push('서비스 유형 일치');
  }
  if (totalScore < 40) {
    reasons.push('기본 매칭');
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
