import { RefObject } from "react";
import { CalenderIcon } from "../../icons";
import { getMonthName } from "../../utils/monthlyTargetUtils";

interface EmptyStateProps {
  chartRef: RefObject<HTMLDivElement>;
  selectedPT: string;
  selectedMonth: number;
  currentYear: number;
  onMonthChange: (month: number) => void;
}

export default function EmptyState({
  chartRef,
  selectedPT,
  selectedMonth,
  currentYear,
  onMonthChange
}: EmptyStateProps) {
  return (
    <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 transition-all duration-300 ease-in-out h-full min-h-[500px] flex flex-col">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Monthly Target - {selectedPT}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getMonthName(selectedMonth)} {currentYear}
          </p>
        </div>

        <div className="relative h-9 w-32">
          <CalenderIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 z-10" />
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="h-full w-full rounded-lg border border-gray-200 bg-white pl-10 pr-8 text-sm
                       appearance-none cursor-pointer
                       dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Tidak Ada Data
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada data target bulanan untuk {selectedPT} di bulan {getMonthName(selectedMonth)} {currentYear}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Silakan pilih bulan lain atau tambahkan data melalui form input
          </p>
        </div>
      </div>
    </div>
  );
}
