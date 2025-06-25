
-- 수요기관 테이블의 기존 정책들을 확인하고 수정
DROP POLICY IF EXISTS "수요기관_insert_policy" ON 수요기관;

-- 인증된 사용자가 자신의 데이터만 삽입할 수 있도록 정책 재생성
CREATE POLICY "수요기관_insert_policy" ON 수요기관
  FOR INSERT
  WITH CHECK (auth.uid()::text = 아이디);

-- 기존 select 정책도 확인 및 재생성
DROP POLICY IF EXISTS "수요기관_select_policy" ON 수요기관;

CREATE POLICY "수요기관_select_policy" ON 수요기관
  FOR SELECT
  USING (true);

-- 공급기업 테이블도 동일하게 수정
DROP POLICY IF EXISTS "공급기업_insert_policy" ON 공급기업;

CREATE POLICY "공급기업_insert_policy" ON 공급기업
  FOR INSERT
  WITH CHECK (auth.uid()::text = 아이디);

-- 회원관리 테이블 정책도 수정
DROP POLICY IF EXISTS "회원관리_insert_policy" ON 회원관리;
DROP POLICY IF EXISTS "회원관리_select_policy" ON 회원관리;

CREATE POLICY "회원관리_select_policy" ON 회원관리
  FOR SELECT
  USING (auth.uid()::text = 아이디);

CREATE POLICY "회원관리_insert_policy" ON 회원관리
  FOR INSERT
  WITH CHECK (auth.uid()::text = 아이디);
