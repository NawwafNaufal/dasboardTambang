import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function BasicTables() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Contoh total items (sesuaikan dengan data asli Anda)
  const totalItems = 100;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      
      <div className="flex gap-3 mb-6">
        {/* Category Select - Tetap biru di light dan dark mode */}
        <div className="relative">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-auto min-w-[120px] h-10 px-4 pr-10 bg-[#465fff] dark:bg-[#465fff] hover:bg-[#465fff] dark:hover:bg-[#465fff] border-0 text-white [&_span]:!text-white
                                      [&_span]:!opacity-100 [&>svg]:hidden">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lamongan Shorebase">Lamongan Shorebase</SelectItem>
              <SelectItem value="PT Semen Tonasa">PT Semen Tonasa</SelectItem>
              <SelectItem value="PT Semen Padang">PT Semen Padang</SelectItem>
              <SelectItem value="Site Omi Sale">Site Omi Sale</SelectItem>
            </SelectContent>
          </Select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
        </div>

        {/* Quantity Select - Hilangkan garis putih di dark mode */}
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-auto min-w-[120px] h-10 px-4 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cotton Fields">Cotton Fields</SelectItem>
            <SelectItem value="Loading Hauling">Loading Hauling</SelectItem>
            <SelectItem value="Drilling">Drilling</SelectItem>
            <SelectItem value="Perintisan Used">Perintisan Used</SelectItem>
            <SelectItem value="Perintisan New">Perintisan New</SelectItem>
            <SelectItem value="Bulldozer Used">Bulldozer Used</SelectItem>
            <SelectItem value="Bulldozer New">Bulldozer New</SelectItem>
            <SelectItem value="Breaker">Breaker</SelectItem>
            <SelectItem value="OB Rehandle">OB Rehandle</SelectItem>
            <SelectItem value="OB Insitu">OB Insitu</SelectItem>
            <SelectItem value="ER">ER</SelectItem>
            <SelectItem value="PPO Direct">PPO Direct</SelectItem>
          </SelectContent>
        </Select>

        {/* Input Tanggal - Tambahkan dark mode styling */}
        <input 
          type="month"
          className="w-auto min-w-[120px] h-9 px-4 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-md cursor-pointer dark:[color-scheme:dark]"
          onChange={(e) => handleSelectChange(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Lamongan Shorebase
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drilling
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Januari 2026
              </p>
            </div>
          </div>
          <BasicTableOne />
          
          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20 h-9 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? "bg-[#465fff] text-white"
                          : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </div>
          </div>
        </div>
      </div>
    </>
  );
}