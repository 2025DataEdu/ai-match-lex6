
-- 공급기업 테이블에 대한 읽기 권한 정책 추가
CREATE POLICY "공급기업 읽기 허용" ON public.공급기업
FOR SELECT USING (true);

-- 만약 위 정책이 너무 광범위하다면, 인증된 사용자만 접근할 수 있도록 제한
-- CREATE POLICY "인증된 사용자 공급기업 읽기 허용" ON public.공급기업
-- FOR SELECT TO authenticated USING (true);
