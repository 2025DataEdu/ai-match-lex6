
-- 회원관리 테이블의 트리거 함수를 수정하여 부서명을 포함한 모든 정보를 저장
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.회원관리 ("아이디", 이메일, 등록일자, 이름, 기업명, 연락처, 유형, 부서명)
  VALUES (
    split_part(NEW.email, '@', 1),
    NEW.email,
    CURRENT_DATE,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'company', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'type', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'department', '')
  );
  RETURN NEW;
END;
$$;

-- 트리거 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
