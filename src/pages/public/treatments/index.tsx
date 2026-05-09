// src/pages/public/treatments/index.tsx
import React from "react";
import { usePublicTreatments } from "./hooks/usePublicTreatments";
import TreatmentCard from "./components/TreatmentCard";
import FilterSidebar from "./components/FilterSidebar";
import Pagination from "../../../components/Shared/Pagination";

const PublicTreatmentsPage: React.FC = () => {
  const {
    treatments,
    loading,
    pagination,
    filters,
    categories,
    handleFilterChange,
    handlePageChange,
  } = usePublicTreatments();

  // Client-side category filtering (since API doesn't have category param yet)
  const filteredTreatments = treatments.filter(t => {
    if (filters.category && t.category !== filters.category) return false;
    return true;
  });

  if (loading && pagination.page === 1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading treatments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Our Treatments & Services</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover our range of premium aesthetic treatments designed to enhance your natural beauty.
        </p>
      </div>

      {/* Filters + Results */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <FilterSidebar
            search={filters.search}
            category={filters.category}
            categories={categories}
            onSearchChange={(val) => handleFilterChange("search", val)}
            onCategoryChange={(val) => handleFilterChange("category", val)}
            onReset={() => {
              handleFilterChange("search", "");
              handleFilterChange("category", "");
            }}
          />
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          {loading && pagination.page > 1 ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredTreatments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No treatments found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTreatments.map((treatment) => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.page}
                    totalItems={pagination.totalCount}
                    pageSize={pagination.pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicTreatmentsPage;