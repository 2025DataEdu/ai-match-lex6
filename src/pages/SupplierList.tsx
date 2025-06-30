
import Navbar from "@/components/Navbar";
import SupplierCard from "@/components/supplier/SupplierCard";
import SupplierSearch from "@/components/supplier/SupplierSearch";
import EmptyState from "@/components/supplier/EmptyState";
import FloatingChatBot from "@/components/FloatingChatBot";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useInterest } from "@/hooks/useInterest";
import { useEffect } from "react";

const SupplierList = () => {
  const {
    suppliers,
    filteredSuppliers,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isLoading,
    fetchSuppliers
  } = useSuppliers();

  const { fetchInterestStats } = useInterest();

  // 공급기업 데이터가 로드된 후 관심 통계 초기화
  useEffect(() => {
    if (suppliers.length > 0) {
      const dummyDemandID = "dummy-demand-id";
      const matchPairs = suppliers.map(supplier => ({
        공급기업일련번호: supplier.공급기업일련번호,
        수요기관일련번호: dummyDemandID
      }));
      fetchInterestStats(matchPairs);
    }
  }, [suppliers, fetchInterestStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">공급기업</h1>
              <p className="text-lg text-gray-600">
                혁신적인 기술과 서비스를 제공하는 공급기업들을 만나보세요
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/supplier-registration" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                공급기업 등록하기
              </Link>
            </Button>
          </div>
          
          <SupplierSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onRefresh={fetchSuppliers}
          />
        </div>

        {filteredSuppliers.length === 0 ? (
          <EmptyState 
            searchTerm={searchTerm}
            totalSuppliers={suppliers.length}
            filteredCount={filteredSuppliers.length}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier, index) => (
              <SupplierCard 
                key={supplier.공급기업일련번호 || index}
                supplier={supplier}
                index={index}
                onUpdate={fetchSuppliers}
              />
            ))}
          </div>
        )}
      </div>
      <FloatingChatBot />
    </div>
  );
};

export default SupplierList;
