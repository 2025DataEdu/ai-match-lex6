
export interface Supplier {
  '공급기업일련번호': string;
  기업명: string;
  유형: string;
  업종: string;
  세부설명: string;
  기업홈페이지?: string;
  유튜브링크?: string;
  보유특허?: string;
  사용자명?: string;
  등록일자?: string;
}

export interface Demand {
  '수요기관일련번호': string;
  수요기관: string;
  유형: string;
  수요내용: string;
  금액: number;
  등록일자?: string;
}

export interface Match {
  supplier: Supplier;
  demand: Demand;
  matchScore: number;
  matchReason: string;
}
