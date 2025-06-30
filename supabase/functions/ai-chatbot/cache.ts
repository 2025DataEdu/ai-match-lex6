
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

// 캐시 확인 함수 - 더 엄격한 조건으로 수정
export async function checkCache(supabase: any, query: string) {
  const queryHash = simpleHash(query.toLowerCase().trim());
  
  // 캐시 확인 - 만료 시간을 더 짧게 설정하고 정확한 매칭만 허용
  const { data: cached, error } = await supabase
    .from('query_cache')
    .select('*')
    .eq('query_hash', queryHash)
    .eq('original_query', query.toLowerCase().trim()) // 정확한 쿼리 매칭
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!error && cached) {
    // 캐시가 너무 자주 사용되지 않도록 랜덤 요소 추가
    const useCache = Math.random() > 0.3; // 70% 확률로 캐시 사용
    
    if (useCache) {
      // 캐시 히트 수 증가
      await supabase
        .from('query_cache')
        .update({ hit_count: cached.hit_count + 1 })
        .eq('id', cached.id);
      
      console.log('Cache hit! Returning cached result');
      return {
        found: true,
        sql: cached.generated_sql,
        data: cached.result_data
      };
    } else {
      console.log('Cache found but skipped for variety');
    }
  }

  return { found: false };
}

export async function saveToCache(supabase: any, query: string, intent: string, results: any[]) {
  const queryHash = simpleHash(query.toLowerCase().trim());
  
  // 통계 쿼리는 캐시하지 않음 (실시간 데이터 필요)
  if (intent === 'statistics') {
    return;
  }
  
  // 결과가 있을 때만 캐시 저장
  if (results && results.length > 0) {
    await supabase
      .from('query_cache')
      .upsert({
        query_hash: queryHash,
        original_query: query.toLowerCase().trim(),
        generated_sql: `Dynamic search for: ${query}`,
        result_data: results,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30분 후 만료
      });
  }
}
