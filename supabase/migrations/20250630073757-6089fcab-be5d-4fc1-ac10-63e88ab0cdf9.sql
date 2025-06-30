
-- admin 사용자를 회원관리 테이블에 추가
INSERT INTO public.회원관리 (
    아이디, 
    이메일, 
    이름, 
    기업명, 
    연락처, 
    유형, 
    부서명, 
    등록일자,
    비밀번호
) VALUES (
    'admin',
    'admin@system.com',
    '시스템 관리자',
    '시스템',
    '000-0000-0000',
    '관리자',
    '시스템관리부',
    CURRENT_DATE,
    'admin3871'
) ON CONFLICT (아이디) DO UPDATE SET
    이메일 = EXCLUDED.이메일,
    이름 = EXCLUDED.이름,
    기업명 = EXCLUDED.기업명,
    연락처 = EXCLUDED.연락처,
    유형 = EXCLUDED.유형,
    부서명 = EXCLUDED.부서명,
    비밀번호 = EXCLUDED.비밀번호;

-- admin 사용자에게 관리자 역할 부여
INSERT INTO public.user_roles (user_id, role) 
VALUES ('admin', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
