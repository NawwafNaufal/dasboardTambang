import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/TableProdukAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react";

export default function TablesAdmin() {
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
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
            <SelectValue placeholder="Quantity" />
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
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Lamongan Shorebase
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Januari 2026
      </p>
    </div>
    <BasicTableOne />
  </div>
</div>
    </>
  );
}