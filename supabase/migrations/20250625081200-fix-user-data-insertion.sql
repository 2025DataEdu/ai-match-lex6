
-- 회원관리 테이블의 트리거 함수를 수정하여 아이디를 이메일의 @ 앞부분으로 설정
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.회원관리 ("아이디", 이메일, 등록일자)
  VALUES (
    split_part(NEW.email, '@', 1),
    NEW.email,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$;

-- 트리거 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS 정책을 아이디 기준으로 수정 (이메일 앞부분 사용)
DROP POLICY IF EXISTS "회원관리_select_policy" ON 회원관리;
DROP POLICY IF EXISTS "회원관리_insert_policy" ON 회원관리;
DROP POLICY IF EXISTS "회원관리_update_policy" ON 회원관리;

CREATE POLICY "회원관리_select_policy" ON 회원관리
  FOR SELECT
  USING (아이디 = split_part(auth.jwt() ->> 'email', '@', 1));

CREATE POLICY "회원관리_insert_policy" ON 회원관리
  FOR INSERT
  WITH CHECK (아이디 = split_part(auth.jwt() ->> 'email', '@', 1));

CREATE POLICY "회원관리_update_policy" ON 회원관리
  FOR UPDATE
  USING (아이디 = split_part(auth.jwt() ->> 'email', '@', 1));

-- 공급기업과 수요기관 테이블의 RLS 정책도 수정
DROP POLICY IF EXISTS "공급기업_insert_policy" ON 공급기업;
CREATE POLICY "공급기업_insert_policy" ON 공급기업
  FOR INSERT
  WITH CHECK (아이디 = split_part(auth.jwt() ->> 'email', '@', 1));

DROP POLICY IF EXISTS "수요기관_insert_policy" ON 수요기관;
CREATE POLICY "수요기관_insert_policy" ON 수요기관
  FOR INSERT
  WITH CHECK (아이디 = split_part(auth.jwt() ->> 'email', '@', 1));
