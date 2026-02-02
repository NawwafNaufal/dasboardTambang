import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

/* =========================
   CUSTOM ICONS
========================= */
const PlanIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const RkpaIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

/* =========================
   DATA PER PT
========================= */
const ptData: Record<string, {
  planRevenue: number;
  planRevenueChange: number;
  revenue: number;
  revenueChange: number;
}> = {
  "PT Semen Tonasa": {
    planRevenue: 3782,
    planRevenueChange: 11.01,
    revenue: 5359,
    revenueChange: -9.05,
  },
  "PT Semen Padang": {
    planRevenue: 4520,
    planRevenueChange: 15.32,
    revenue: 6100,
    revenueChange: 12.45,
  },
  "Lamongan Shorebase": {
    planRevenue: 3200,
    planRevenueChange: -5.21,
    revenue: 4800,
    revenueChange: 8.75,
  },
  "UTSG": {
    planRevenue: 5100,
    planRevenueChange: 18.90,
    revenue: 7200,
    revenueChange: 22.15,
  },
};

interface EcommerceMetricsProps {
  selectedPT?: string;
}

export default function EcommerceMetrics({ selectedPT = "PT Semen Tonasa" }: EcommerceMetricsProps) {
  const currentPT = selectedPT && ptData[selectedPT] ? selectedPT : "PT Semen Tonasa";
  const data = ptData[currentPT];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Plan Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#60A5FA]/10 rounded-xl dark:bg-[#60A5FA]/20">
          <PlanIcon className="text-[#27b5f5] size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Plan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.planRevenue.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* <!-- RKPA Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#F87171]/10 rounded-xl dark:bg-[#F87171]/20">
          <RkpaIcon className="text-[#F87171] size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              RKPA
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.revenue.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}