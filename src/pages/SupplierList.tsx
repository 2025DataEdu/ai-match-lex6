
import Navbar from "@/components/Navbar";
import SupplierCard from "@/components/supplier/SupplierCard";
import SupplierSearch from "@/components/supplier/SupplierSearch";
import LoadingSkeletons from "@/components/supplier/LoadingSkeletons";
import EmptyState from "@/components/supplier/EmptyState";
import FloatingChatBot from "@/components/FloatingChatBot";
import { useSuppliers } from "@/hooks/useSuppliers";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">공급기업</h1>
          <p className="text-lg text-gray-600 mb-6">
            혁신적인 기술과 서비스를 제공하는 공급기업들을 만나보세요
          </p>
          
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

        {isLoading ? (
          <LoadingSkeletons />
        ) : filteredSuppliers.length === 0 ? (
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
