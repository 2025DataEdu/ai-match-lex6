
-- 사용자 역할 열거형 생성
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 사용자 역할 테이블 생성
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES 회원관리(아이디) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- RLS 활성화
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 사용자 역할 확인 함수 (보안 정의자)
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 현재 사용자의 역할 확인 함수
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(
    split_part(auth.jwt() ->> 'email', '@', 1),
    'admin'::app_role
  )
$$;

-- 관리자만 user_roles 테이블을 볼 수 있도록 정책 설정
CREATE POLICY "Only admins can view user roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Only admins can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.is_admin());

-- 공급기업 테이블에 관리자 권한 추가
CREATE POLICY "공급기업_admin_policy" ON 공급기업
  FOR ALL
  USING (public.is_admin());

-- 수요기관 테이블에 관리자 권한 추가  
CREATE POLICY "수요기관_admin_policy" ON 수요기관
  FOR ALL
  USING (public.is_admin());

-- 회원관리 테이블에 관리자 권한 추가
CREATE POLICY "회원관리_admin_policy" ON 회원관리
  FOR ALL
  USING (public.is_admin());
