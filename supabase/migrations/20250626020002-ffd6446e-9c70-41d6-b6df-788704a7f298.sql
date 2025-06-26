
-- 동적 SQL 쿼리를 실행할 수 있는 함수 생성
CREATE OR REPLACE FUNCTION execute_dynamic_query(query_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    rec record;
    results jsonb[] := '{}';
BEGIN
    -- SELECT 쿼리만 허용
    IF NOT (UPPER(TRIM(query_text)) LIKE 'SELECT%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;
    
    -- 위험한 키워드 차단
    IF UPPER(query_text) ~ '(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)' THEN
        RAISE EXCEPTION 'Query contains prohibited keywords';
    END IF;
    
    -- 쿼리 실행
    FOR rec IN EXECUTE query_text LOOP
        results := results || to_jsonb(rec);
    END LOOP;
    
    RETURN to_jsonb(results);
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Query execution failed: %', SQLERRM;
END;
$$;
