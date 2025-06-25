
-- 회원관리 테이블에 사용자가 회원가입할 때 자동으로 프로필을 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.회원관리 ("아이디(PK)", 이메일, 등록일자)
  VALUES (
    NEW.id::text,
    NEW.email,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$;

-- 새 사용자가 가입할 때마다 회원관리 테이블에 레코드를 생성하는 트리거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 기존 사용자들을 위한 데이터 보정 (현재 로그인한 사용자의 프로필이 없다면 생성)
INSERT INTO public.회원관리 ("아이디(PK)", 등록일자)
SELECT 
  auth.uid()::text,
  CURRENT_DATE
WHERE auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.회원관리 
    WHERE "아이디(PK)" = auth.uid()::text
  );
