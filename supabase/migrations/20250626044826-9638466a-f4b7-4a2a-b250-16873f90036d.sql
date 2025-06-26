
-- 관심 표시 테이블 생성
CREATE TABLE public.관심표시 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  사용자아이디 TEXT NOT NULL,
  공급기업일련번호 TEXT NOT NULL,
  수요기관일련번호 TEXT NOT NULL,
  등록일자 TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(사용자아이디, 공급기업일련번호, 수요기관일련번호)
);

-- RLS 정책 설정
ALTER TABLE public.관심표시 ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 관심 표시만 볼 수 있음
CREATE POLICY "사용자는 자신의 관심표시만 조회가능" ON public.관심표시
  FOR SELECT 
  USING (사용자아이디 = COALESCE(auth.jwt() ->> 'sub', ''));

-- 사용자는 자신의 관심 표시만 추가할 수 있음
CREATE POLICY "사용자는 자신의 관심표시만 추가가능" ON public.관심표시
  FOR INSERT 
  WITH CHECK (사용자아이디 = COALESCE(auth.jwt() ->> 'sub', ''));

-- 사용자는 자신의 관심 표시만 삭제할 수 있음
CREATE POLICY "사용자는 자신의 관심표시만 삭제가능" ON public.관심표시
  FOR DELETE 
  USING (사용자아이디 = COALESCE(auth.jwt() ->> 'sub', ''));

-- 관심 수 집계를 위한 뷰 생성
CREATE OR REPLACE VIEW public.관심통계 AS
SELECT 
  공급기업일련번호,
  수요기관일련번호,
  COUNT(*) as 관심수
FROM public.관심표시
GROUP BY 공급기업일련번호, 수요기관일련번호;
