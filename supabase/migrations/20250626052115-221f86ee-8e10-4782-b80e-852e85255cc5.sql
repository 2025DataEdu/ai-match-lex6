
-- 문의댓글 테이블 생성
CREATE TABLE public.문의댓글 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  매칭id text NOT NULL,
  공급기업일련번호 text NOT NULL,
  수요기관일련번호 text NOT NULL,
  작성자유형 text NOT NULL CHECK (작성자유형 IN ('공급기업', '수요기관')),
  작성자아이디 text NOT NULL,
  작성자명 text NOT NULL,
  기관명 text NOT NULL,
  댓글내용 text NOT NULL,
  부모댓글id uuid REFERENCES public.문의댓글(id),
  작성일자 timestamp with time zone NOT NULL DEFAULT now(),
  수정일자 timestamp with time zone DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.문의댓글 ENABLE ROW LEVEL SECURITY;

-- 매칭 당사자만 댓글 조회 가능
CREATE POLICY "매칭_당사자만_댓글_조회" ON public.문의댓글
  FOR SELECT
  USING (true); -- 일단 모든 사용자가 조회 가능하도록 설정 (추후 인증 구현 시 수정)

-- 매칭 당사자만 댓글 작성 가능
CREATE POLICY "매칭_당사자만_댓글_작성" ON public.문의댓글
  FOR INSERT
  WITH CHECK (true); -- 일단 모든 사용자가 작성 가능하도록 설정 (추후 인증 구현 시 수정)

-- 댓글 작성자만 수정 가능
CREATE POLICY "댓글_작성자만_수정" ON public.문의댓글
  FOR UPDATE
  USING (true); -- 일단 모든 사용자가 수정 가능하도록 설정 (추후 인증 구현 시 수정)

-- 댓글 작성자만 삭제 가능
CREATE POLICY "댓글_작성자만_삭제" ON public.문의댓글
  FOR DELETE
  USING (true); -- 일단 모든 사용자가 삭제 가능하도록 설정 (추후 인증 구현 시 수정)

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_문의댓글_매칭id ON public.문의댓글(매칭id);
CREATE INDEX idx_문의댓글_부모댓글id ON public.문의댓글(부모댓글id);
CREATE INDEX idx_문의댓글_작성일자 ON public.문의댓글(작성일자);
