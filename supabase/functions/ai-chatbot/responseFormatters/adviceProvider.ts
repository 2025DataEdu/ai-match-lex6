
export function addServiceSpecificAdvice(serviceType: string | null): string {
  if (!serviceType) return '';
  
  if (serviceType.includes('챗봇') || serviceType.includes('대화형')) {
    return '\n💡 **AI 챗봇 도입 시 확인사항**\n✓ 자연어 이해 정확도 및 학습 데이터\n✓ 기존 시스템 연동 가능성\n✓ 다국어 지원 및 커스터마이징\n✓ 유지보수 및 업데이트 정책\n';
  } else if (serviceType.includes('비전') || serviceType.includes('이미지') || serviceType.includes('CCTV')) {
    return '\n💡 **AI 비전 솔루션 도입 시 확인사항**\n✓ 실시간 처리 성능 및 정확도\n✓ 하드웨어 요구사항\n✓ 프라이버시 및 보안 정책\n✓ 기존 CCTV 시스템 호환성\n';
  }
  
  return '';
}
