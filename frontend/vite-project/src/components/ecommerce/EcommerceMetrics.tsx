import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "../../icons";
import { useState, useEffect } from "react";

const PlanIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const RkpaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

interface ActivityData {
  activityName: string;
  planRevenue: number;
  planRevenueChange: number;
  rkpaRevenue: number;
  rkpaRevenueChange: number;
}

interface SiteActivities {
  activities: ActivityData[];
}

interface ApiResponse {
  success: boolean;
  year: number;
  data: {
    [siteName: string]: SiteActivities;
  };
}

interface EcommerceMetricsProps {
  selectedPT?: string;
  currentActivity?: string;
  apiUrl?: string;
  year?: number;
}

const toSnakeCase = (str: string): string => {
  if (!str) return "";
  if (str.includes("_") && !str.includes(" ")) return str.toLowerCase();
  return str.toLowerCase().replace(/\s+/g, "_");
};

// ✅ Tampilkan apa adanya tanpa paksa 3 desimal
const formatNumber = (num: number): string => {
  return num.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
};

export default function EcommerceMetrics({
  selectedPT = "PT Semen Tonasa",
  currentActivity,
  apiUrl = "http://76.13.198.60:4000/api/plan-rkpa",
  year = 2026,
}: EcommerceMetricsProps) {
  const [apiData, setApiData] = useState<{ [siteName: string]: SiteActivities } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}?year=${year}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result: ApiResponse = await response.json();
        if (result.success) {
          setApiData(result.data);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, year]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {[PlanIcon, RkpaIcon].map((Icon, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-center justify-center h-32">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !apiData || !apiData[selectedPT]) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {[{ Icon: PlanIcon, label: "Plan" }, { Icon: RkpaIcon, label: "RKPA" }].map(({ Icon, label }) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Icon className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada data</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ptActivities = apiData[selectedPT].activities;
  const normalizedCurrent = toSnakeCase(currentActivity || "");

  const activityData = normalizedCurrent
    ? ptActivities.find((act) => toSnakeCase(act.activityName) === normalizedCurrent)
    : ptActivities[0];

  const displayActivity = activityData || ptActivities[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Plan Metric */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-[#60A5FA]/10 rounded-xl dark:bg-[#60A5FA]/20">
            <PlanIcon className="text-[#27b5f5] size-6" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Plan</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {formatNumber(displayActivity.planRevenue)}
              </h4>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              displayActivity.planRevenueChange >= 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {displayActivity.planRevenueChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(displayActivity.planRevenueChange)}%
            </span>
          </div>
        </div>

        {/* RKPA Metric */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-[#F87171]/10 rounded-xl dark:bg-[#F87171]/20">
            <RkpaIcon className="text-[#F87171] size-6" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">RKPA</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {formatNumber(displayActivity.rkpaRevenue)}
              </h4>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              displayActivity.rkpaRevenueChange >= 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {displayActivity.rkpaRevenueChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(displayActivity.rkpaRevenueChange)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}