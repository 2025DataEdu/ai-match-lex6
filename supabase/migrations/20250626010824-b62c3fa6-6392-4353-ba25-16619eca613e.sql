
-- pgvector 확장 설치
CREATE EXTENSION IF NOT EXISTS vector;

-- 임베딩 저장용 테이블 생성
CREATE TABLE public.embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 모델의 임베딩 차원
  metadata JSONB,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 벡터 유사도 검색을 위한 인덱스 생성
CREATE INDEX ON public.embeddings USING ivfflat (embedding vector_cosine_ops);

-- 채팅 기록 저장용 테이블 생성
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- embeddings 테이블은 모든 인증된 사용자가 읽기 가능
CREATE POLICY "embeddings_select_policy" ON public.embeddings
  FOR SELECT
  USING (true);

-- chat_messages는 사용자별 접근 제한
CREATE POLICY "chat_messages_select_policy" ON public.chat_messages
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "chat_messages_insert_policy" ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- 임베딩 생성을 위한 함수 생성
CREATE OR REPLACE FUNCTION public.match_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.78,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  table_name text,
  record_id text,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    embeddings.table_name,
    embeddings.record_id,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
