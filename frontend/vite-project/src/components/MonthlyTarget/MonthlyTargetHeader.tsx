import { CalenderIcon } from "../../icons";
import { getMonthName } from "../../utils/monthlyTargetUtils";

interface MonthlyTargetHeaderProps {
  siteName: string;
  currentActivity?: string;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

export default function MonthlyTargetHeader({
  siteName,
  currentActivity,
  selectedMonth,
  onMonthChange
}: MonthlyTargetHeaderProps) {
  return (
    <div className="flex justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Target - {siteName}
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          {currentActivity || "All Activities"}
        </p>
      </div>
      <div className="flex gap-2">
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
    </div>
  );
}