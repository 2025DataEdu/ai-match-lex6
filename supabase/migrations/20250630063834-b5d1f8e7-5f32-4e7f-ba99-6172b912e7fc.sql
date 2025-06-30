
-- 공급기업 테이블에 추출된 키워드 컬럼 추가
ALTER TABLE 공급기업 
ADD COLUMN IF NOT EXISTS 추출키워드 TEXT;

-- 수요기관 테이블에 추출된 키워드 컬럼 추가
ALTER TABLE 수요기관 
ADD COLUMN IF NOT EXISTS 추출키워드 TEXT;

-- 키워드 추출 상태를 추적하기 위한 컬럼 추가
ALTER TABLE 공급기업 
ADD COLUMN IF NOT EXISTS 키워드추출상태 TEXT DEFAULT 'pending';

ALTER TABLE 수요기관 
ADD COLUMN IF NOT EXISTS 키워드추출상태 TEXT DEFAULT 'pending';
