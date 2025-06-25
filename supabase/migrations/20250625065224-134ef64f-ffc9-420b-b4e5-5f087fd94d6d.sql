
-- 기존 정책들 삭제 (혹시 부분적으로 생성되었을 수 있음)
DROP POLICY IF EXISTS "공급기업_select_policy" ON 공급기업;
DROP POLICY IF EXISTS "공급기업_insert_policy" ON 공급기업;
DROP POLICY IF EXISTS "수요기관_select_policy" ON 수요기관;
DROP POLICY IF EXISTS "수요기관_insert_policy" ON 수요기관;
DROP POLICY IF EXISTS "회원관리_select_policy" ON 회원관리;
DROP POLICY IF EXISTS "회원관리_insert_policy" ON 회원관리;

-- 공급기업 테이블에 RLS 정책 추가
ALTER TABLE 공급기업 ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 공급기업 데이터를 조회할 수 있도록 허용
CREATE POLICY "공급기업_select_policy" ON 공급기업
  FOR SELECT
  USING (true);

-- 인증된 사용자만 공급기업 데이터를 삽입할 수 있도록 허용 (타입 캐스팅 수정)
CREATE POLICY "공급기업_insert_policy" ON 공급기업
  FOR INSERT
  WITH CHECK (auth.uid()::text = "아이디(FK)");

-- 수요기관 테이블에 RLS 정책 추가
ALTER TABLE 수요기관 ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 수요기관 데이터를 조회할 수 있도록 허용
CREATE POLICY "수요기관_select_policy" ON 수요기관
  FOR SELECT
  USING (true);

-- 인증된 사용자만 수요기관 데이터를 삽입할 수 있도록 허용 (타입 캐스팅 수정)
CREATE POLICY "수요기관_insert_policy" ON 수요기관
  FOR INSERT
  WITH CHECK (auth.uid()::text = "아이디(FK)");

-- 회원관리 테이블에 RLS 정책 추가
ALTER TABLE 회원관리 ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자만 자신의 정보를 조회할 수 있도록 허용 (타입 캐스팅 수정)
CREATE POLICY "회원관리_select_policy" ON 회원관리
  FOR SELECT
  USING (auth.uid()::text = "아이디(PK)");

-- 인증된 사용자만 자신의 정보를 삽입할 수 있도록 허용 (타입 캐스팅 수정)
CREATE POLICY "회원관리_insert_policy" ON 회원관리
  FOR INSERT
  WITH CHECK (auth.uid()::text = "아이디(PK)");
