
-- 공급기업 테이블에 UPDATE와 DELETE 정책 추가
CREATE POLICY "공급기업_update_policy" ON 공급기업
  FOR UPDATE
  USING (auth.uid()::text = 아이디);

CREATE POLICY "공급기업_delete_policy" ON 공급기업
  FOR DELETE
  USING (auth.uid()::text = 아이디);

-- 수요기관 테이블에 UPDATE와 DELETE 정책 추가
CREATE POLICY "수요기관_update_policy" ON 수요기관
  FOR UPDATE
  USING (auth.uid()::text = 아이디);

CREATE POLICY "수요기관_delete_policy" ON 수요기관
  FOR DELETE
  USING (auth.uid()::text = 아이디);
