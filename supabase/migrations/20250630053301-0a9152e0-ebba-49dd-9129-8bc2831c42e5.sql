
-- 공급기업 테이블 최적화용 인덱스 생성 (기본 텍스트 검색 사용)
CREATE INDEX IF NOT EXISTS idx_공급기업_기업명 ON 공급기업 USING gin(to_tsvector('simple', 기업명));
CREATE INDEX IF NOT EXISTS idx_공급기업_업종 ON 공급기업 USING gin(to_tsvector('simple', 업종));
CREATE INDEX IF NOT EXISTS idx_공급기업_세부설명 ON 공급기업 USING gin(to_tsvector('simple', 세부설명));
CREATE INDEX IF NOT EXISTS idx_공급기업_보유특허 ON 공급기업 USING gin(to_tsvector('simple', 보유특허));
CREATE INDEX IF NOT EXISTS idx_공급기업_유형 ON 공급기업(유형);

-- 수요기관 테이블 최적화용 인덱스 생성 (기본 텍스트 검색 사용)
CREATE INDEX IF NOT EXISTS idx_수요기관_수요기관명 ON 수요기관 USING gin(to_tsvector('simple', 수요기관));
CREATE INDEX IF NOT EXISTS idx_수요기관_수요내용 ON 수요기관 USING gin(to_tsvector('simple', 수요내용));
CREATE INDEX IF NOT EXISTS idx_수요기관_금액 ON 수요기관(금액);
CREATE INDEX IF NOT EXISTS idx_수요기관_유형 ON 수요기관(유형);
CREATE INDEX IF NOT EXISTS idx_수요기관_기타요구사항 ON 수요기관 USING gin(to_tsvector('simple', 기타요구사항));

-- 쿼리 캐시 테이블 생성
CREATE TABLE IF NOT EXISTS public.query_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_hash TEXT NOT NULL UNIQUE,
  original_query TEXT NOT NULL,
  generated_sql TEXT NOT NULL,
  result_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '1 hour'),
  hit_count INTEGER DEFAULT 1
);

-- 캐시 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_query_cache_hash ON query_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_query_cache_expires ON query_cache(expires_at);

-- 만료된 캐시 정리 함수
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM query_cache WHERE expires_at < now();
END;
$$;
