

interface MyPageHeaderProps {
  suppliersCount: number;
  demandsCount: number;
}

export const MyPageHeader = ({ suppliersCount, demandsCount }: MyPageHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
      <p className="text-gray-600 mt-2">
        내가 등록한 공급기업과 수요내용을 관리하세요
      </p>
    </div>
  );
};

