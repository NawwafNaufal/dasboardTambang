import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "../../icons";
import { useState, useEffect } from "react";

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
   INTERFACE
========================= */
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

export default function EcommerceMetrics({ 
  selectedPT = "PT Semen Tonasa",
  currentActivity,
  apiUrl = "http://localhost:4000/api/plan-rkpa",
  year = 2025
}: EcommerceMetricsProps) {
  const [apiData, setApiData] = useState<{ [siteName: string]: SiteActivities } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 [EcommerceMetrics] Fetching Plan-RKPA data for year:', year);
        const response = await fetch(`${apiUrl}?year=${year}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('📊 [EcommerceMetrics] Plan-RKPA API Response:', result);
        
        if (result.success) {
          setApiData(result.data);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        console.error("❌ [EcommerceMetrics] Error fetching Plan-RKPA data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, year]);

  // ✅ Log perubahan currentActivity untuk debugging
  useEffect(() => {
    console.log('🎯 [EcommerceMetrics] currentActivity changed to:', currentActivity);
  }, [currentActivity]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {/* Plan Loading Skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
              </div>
            </div>
          </div>

          {/* RKPA Loading Skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !apiData) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {/* Plan Error Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <PlanIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tidak ada data
                </p>
              </div>
            </div>
          </div>

          {/* RKPA Error Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <RkpaIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RKPA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tidak ada data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if selected PT exists in data
  const availableSites = Object.keys(apiData);
  const currentPT = availableSites.includes(selectedPT) ? selectedPT : availableSites[0];
  
  if (!currentPT || !apiData[currentPT]) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {/* Plan No Data Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <PlanIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tidak ada data untuk {selectedPT}
                </p>
              </div>
            </div>
          </div>

          {/* RKPA No Data Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <RkpaIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RKPA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tidak ada data untuk {selectedPT}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ptActivities = apiData[currentPT].activities;

  if (ptActivities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {/* Plan No Activities Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <PlanIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada aktivitas
                </p>
              </div>
            </div>
          </div>

          {/* RKPA No Activities Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <RkpaIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RKPA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada aktivitas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Fungsi normalisasi nama aktivitas
  const normalizeActivityName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  // ✅ Cari aktivitas yang sesuai dengan currentActivity dari navbar
  console.log('🔎 [EcommerceMetrics] Looking for activity:', currentActivity);
  console.log('📋 [EcommerceMetrics] Available activities:', ptActivities.map(a => a.activityName));
  
  const activityData = currentActivity 
    ? ptActivities.find(act => 
        normalizeActivityName(act.activityName) === normalizeActivityName(currentActivity)
      )
    : ptActivities[0];

  // Fallback jika aktivitas tidak ditemukan
  const displayActivity = activityData || ptActivities[0];
  
  console.log('🔍 [EcommerceMetrics] Normalized search:', currentActivity ? normalizeActivityName(currentActivity) : 'none');
  console.log('✅ [EcommerceMetrics] Displaying activity:', displayActivity.activityName);

  return (
    <div className="space-y-4">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Plan Metric */}
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
                {displayActivity.planRevenue.toLocaleString()}
              </h4>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              displayActivity.planRevenueChange >= 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                RKPA
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {displayActivity.rkpaRevenue.toLocaleString()}
              </h4>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              displayActivity.rkpaRevenueChange >= 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
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