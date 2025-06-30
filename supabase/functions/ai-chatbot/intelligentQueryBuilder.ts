
import { KeywordAnalysis } from './naturalLanguageProcessor.ts';

export function buildIntelligentQuery(analysis: KeywordAnalysis): string {
  const { primaryKeywords, serviceType, context } = analysis;
  
  if (!primaryKeywords || primaryKeywords.length === 0) {
    return buildDefaultQuery();
  }

  // 서비스 유형별 특화 쿼리 생성
  if (serviceType) {
    return buildServiceTypeQuery(serviceType, primaryKeywords);
  }

  // 키워드 기반 종합 검색 쿼리
  return buildKeywordQuery(primaryKeywords, context);
}

function buildServiceTypeQuery(serviceType: string, keywords: string[]): string {
  const keywordConditions = keywords.map(keyword => 
    `(기업명 ILIKE '%${sanitizeKeyword(keyword)}%' OR 
      세부설명 ILIKE '%${sanitizeKeyword(keyword)}%' OR 
      유형 ILIKE '%${sanitizeKeyword(keyword)}%')`
  ).join(' OR ');

  const serviceTypeCondition = `유형 ILIKE '%${sanitizeKeyword(serviceType)}%'`;

  return `
    SELECT *, 
           CASE 
             WHEN 유형 ILIKE '%${sanitizeKeyword(serviceType)}%' THEN 90
             WHEN (${keywordConditions}) THEN 80
             ELSE 60
           END as relevance_score
    FROM 공급기업 
    WHERE (${serviceTypeCondition}) OR (${keywordConditions})
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
}

function buildKeywordQuery(keywords: string[], context: any): string {
  const conditions = keywords.map((keyword, index) => {
    const weight = Math.max(90 - (index * 10), 50); // 첫 번째 키워드가 가장 높은 가중치
    return `
      CASE 
        WHEN 유형 ILIKE '%${sanitizeKeyword(keyword)}%' THEN ${weight + 10}
        WHEN 기업명 ILIKE '%${sanitizeKeyword(keyword)}%' THEN ${weight + 5}
        WHEN 세부설명 ILIKE '%${sanitizeKeyword(keyword)}%' THEN ${weight}
        WHEN 업종 ILIKE '%${sanitizeKeyword(keyword)}%' THEN ${weight - 10}
        ELSE 0
      END`;
  });

  const whereConditions = keywords.map(keyword => 
    `(기업명 ILIKE '%${sanitizeKeyword(keyword)}%' OR 
      세부설명 ILIKE '%${sanitizeKeyword(keyword)}%' OR 
      유형 ILIKE '%${sanitizeKeyword(keyword)}%' OR 
      업종 ILIKE '%${sanitizeKeyword(keyword)}%')`
  ).join(' OR ');

  const relevanceCalculation = conditions.join(' + ');

  return `
    SELECT *, 
           (${relevanceCalculation}) as relevance_score
    FROM 공급기업 
    WHERE ${whereConditions}
    HAVING relevance_score > 0
    ORDER BY relevance_score DESC, 등록일자 DESC 
    LIMIT 10`;
}

function buildDefaultQuery(): string {
  return `
    SELECT *, 50 as relevance_score
    FROM 공급기업 
    WHERE 세부설명 IS NOT NULL
    ORDER BY 등록일자 DESC 
    LIMIT 10`;
}

function sanitizeKeyword(keyword: string): string {
  return keyword.replace(/[^a-zA-Z0-9가-힣\s]/g, '').trim();
}
