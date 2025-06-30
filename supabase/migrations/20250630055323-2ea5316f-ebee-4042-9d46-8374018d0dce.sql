
-- 공급기업 테이블의 기존 서비스 유형을 새로운 AI 전문 분류로 업데이트
UPDATE 공급기업 
SET 유형 = CASE 
  WHEN 유형 = 'AI 챗봇/대화형AI' THEN 'AI 챗봇/대화형AI'
  WHEN 유형 = '컴퓨터 비전/이미지AI' THEN '컴퓨터 비전/이미지AI'
  WHEN 유형 = '자연어처리/텍스트AI' THEN '자연어처리/텍스트AI'
  WHEN 유형 = '음성인식/음성AI' THEN '음성인식/음성AI'
  WHEN 유형 = '예측분석/데이터AI' THEN '예측분석/데이터AI'
  WHEN 유형 = '추천시스템/개인화AI' THEN '추천시스템/개인화AI'
  WHEN 유형 = '로봇/자동화AI' THEN '로봇/자동화AI'
  WHEN 유형 = 'AI 플랫폼/인프라' THEN 'AI 플랫폼/인프라'
  WHEN 유형 = 'AI 교육/컨설팅' THEN 'AI 교육/컨설팅'
  WHEN 유형 = '기타 AI 서비스' THEN '기타 AI 서비스'
  -- 기존 데이터가 다른 형태일 경우를 위한 매핑
  WHEN 유형 LIKE '%챗봇%' OR 유형 LIKE '%대화%' THEN 'AI 챗봇/대화형AI'
  WHEN 유형 LIKE '%비전%' OR 유형 LIKE '%이미지%' OR 유형 LIKE '%영상%' THEN '컴퓨터 비전/이미지AI'
  WHEN 유형 LIKE '%자연어%' OR 유형 LIKE '%텍스트%' OR 유형 LIKE '%언어%' THEN '자연어처리/텍스트AI'
  WHEN 유형 LIKE '%음성%' OR 유형 LIKE '%음향%' THEN '음성인식/음성AI'
  WHEN 유형 LIKE '%예측%' OR 유형 LIKE '%분석%' OR 유형 LIKE '%데이터%' THEN '예측분석/데이터AI'
  WHEN 유형 LIKE '%추천%' OR 유형 LIKE '%개인화%' THEN '추천시스템/개인화AI'
  WHEN 유형 LIKE '%로봇%' OR 유형 LIKE '%자동화%' THEN '로봇/자동화AI'
  WHEN 유형 LIKE '%플랫폼%' OR 유형 LIKE '%인프라%' THEN 'AI 플랫폼/인프라'
  WHEN 유형 LIKE '%교육%' OR 유형 LIKE '%컨설팅%' THEN 'AI 교육/컨설팅'
  ELSE '기타 AI 서비스'
END
WHERE 유형 IS NOT NULL;

-- 수요기관 테이블의 기존 서비스 유형을 새로운 AI 전문 분류로 업데이트
UPDATE 수요기관 
SET 유형 = CASE 
  WHEN 유형 = 'AI 챗봇/대화형AI' THEN 'AI 챗봇/대화형AI'
  WHEN 유형 = '컴퓨터 비전/이미지AI' THEN '컴퓨터 비전/이미지AI'
  WHEN 유형 = '자연어처리/텍스트AI' THEN '자연어처리/텍스트AI'
  WHEN 유형 = '음성인식/음성AI' THEN '음성인식/음성AI'
  WHEN 유형 = '예측분석/데이터AI' THEN '예측분석/데이터AI'
  WHEN 유형 = '추천시스템/개인화AI' THEN '추천시스템/개인화AI'
  WHEN 유형 = '로봇/자동화AI' THEN '로봇/자동화AI'
  WHEN 유형 = 'AI 플랫폼/인프라' THEN 'AI 플랫폼/인프라'
  WHEN 유형 = 'AI 교육/컨설팅' THEN 'AI 교육/컨설팅'
  WHEN 유형 = '기타 AI 서비스' THEN '기타 AI 서비스'
  -- 기존 데이터가 다른 형태일 경우를 위한 매핑
  WHEN 유형 LIKE '%챗봇%' OR 유형 LIKE '%대화%' THEN 'AI 챗봇/대화형AI'
  WHEN 유형 LIKE '%비전%' OR 유형 LIKE '%이미지%' OR 유형 LIKE '%영상%' THEN '컴퓨터 비전/이미지AI'
  WHEN 유형 LIKE '%자연어%' OR 유형 LIKE '%텍스트%' OR 유형 LIKE '%언어%' THEN '자연어처리/텍스트AI'
  WHEN 유형 LIKE '%음성%' OR 유형 LIKE '%음향%' THEN '음성인식/음성AI'
  WHEN 유형 LIKE '%예측%' OR 유형 LIKE '%분석%' OR 유형 LIKE '%데이터%' THEN '예측분석/데이터AI'
  WHEN 유형 LIKE '%추천%' OR 유형 LIKE '%개인화%' THEN '추천시스템/개인화AI'
  WHEN 유형 LIKE '%로봇%' OR 유형 LIKE '%자동화%' THEN '로봇/자동화AI'
  WHEN 유형 LIKE '%플랫폼%' OR 유형 LIKE '%인프라%' THEN 'AI 플랫폼/인프라'
  WHEN 유형 LIKE '%교육%' OR 유형 LIKE '%컨설팅%' THEN 'AI 교육/컨설팅'
  ELSE '기타 AI 서비스'
END
WHERE 유형 IS NOT NULL;
