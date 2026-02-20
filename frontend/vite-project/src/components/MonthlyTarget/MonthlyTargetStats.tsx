import type { CurrentData } from "../../interface/monthlyTarget";

interface MonthlyTargetStatsProps {
  currentData: CurrentData;
}

export default function MonthlyTargetStats({ currentData }: MonthlyTargetStatsProps) {
  return (
    <div className="flex items-center justify-center gap-5 px-6 py-4 sm:gap-8 sm:py-5 bg-white dark:bg-gray-900 rounded-b-2xl border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out">
      <StatItem label="Plan" value={currentData.plan} />
      <Divider />
      <StatItem label="Actual" value={currentData.actual} />
      <Divider />
      <StatItem label="Average" value={currentData.today} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 max-w-[120px]">
      <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
        {label}
      </p>
      <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
        {value.toLocaleString('id-ID', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}
      </p>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-gray-200 h-7 dark:bg-gray-800 flex-shrink-0"></div>;
}