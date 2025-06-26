
import DemandCard from "./DemandCard";

interface Demand {
  수요기관일련번호: string;
  수요기관: string;
  부서명: string;
  사용자명: string;
  유형: string;
  수요내용: string;
  금액: number;
  시작일: string;
  종료일: string;
  기타요구사항: string;
  등록일자: string;
}

interface DemandGridProps {
  demands: Demand[];
}

const DemandGrid = ({ demands }: DemandGridProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {demands.map((demand) => (
        <DemandCard key={demand.수요기관일련번호} demand={demand} />
      ))}
    </div>
  );
};

export default DemandGrid;
