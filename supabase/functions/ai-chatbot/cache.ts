
// 간단한 해시 함수
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash).toString(16);
}

// 캐시 확인 및 저장 함수
export async function checkCache(supabase: any, query: string) {
  const queryHash = simpleHash(query.toLowerCase().trim());
  
  // 캐시 확인
  const { data: cached, error } = await supabase
    .from('query_cache')
    .select('*')
    .eq('query_hash', queryHash)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!error && cached) {
    // 캐시 히트 수 증가
    await supabase
      .from('query_cache')
      .update({ hit_count: cached.hit_count + 1 })
      .eq('id', cached.id);
    
    return {
      found: true,
      sql: cached.generated_sql,
      data: cached.result_data
    };
  }

  return { found: false };
}

export async function saveToCache(supabase: any, query: string, sql: string, results: any[]) {
  const queryHash = simpleHash(query.toLowerCase().trim());
  
  await supabase
    .from('query_cache')
    .upsert({
      query_hash: queryHash,
      original_query: query,
      generated_sql: sql,
      result_data: results,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1시간 후 만료
    });
}
