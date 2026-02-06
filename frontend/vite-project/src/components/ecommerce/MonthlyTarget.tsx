import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useRef } from "react";
import { CalenderIcon } from "../../icons";

interface ActivityBreakdown {
  [key: string]: {
    plan: number;
    actual: number;
    todayActual: number;
    percentage: number;
  };
}

interface MonthlyTargetData {
  site: string;
  month: string;
  year: number;
  totalPlan: number;
  totalActual: number;
  todayActual: number;
  percentage: number;
  deviation: number;
  activityBreakdown: ActivityBreakdown;
}

interface MonthlyTargetProps {
  selectedPT?: string;
  currentActivity?: string;
}

export default function MonthlyTarget({ 
  selectedPT = "PT Semen Tonasa",
  currentActivity
}: MonthlyTargetProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [data, setData] = useState<MonthlyTargetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const API_URL = "http://localhost:4000";

  const normalizeActivityName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  const getMonthName = (monthNum: number) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[monthNum - 1];
  };

  useEffect(() => {
    const fetchMonthlyTarget = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${API_URL}/api/monthly-target/${encodeURIComponent(selectedPT)}/${currentYear}/${selectedMonth}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        
        if (result.data) {
          setData(result.data);
          console.log('📊 [MonthlyTarget] Data loaded:', result.data);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error('❌ [MonthlyTarget] Error fetching monthly target:', err);
        setError('Failed to load monthly target data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyTarget();
  }, [selectedPT, selectedMonth, currentYear]);

  useEffect(() => {
    console.log('🎯 [MonthlyTarget] currentActivity changed to:', currentActivity);
  }, [currentActivity]);
  
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        setChartKey(prev => prev + 1);
      }, 350);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out">
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 transition-all duration-300 ease-in-out h-full min-h-[500px] flex flex-col">
        {/* Header with Month Selector */}
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Monthly Target - {selectedPT}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getMonthName(selectedMonth)} {currentYear}
            </p>
          </div>

          {/* Month Selector - Always visible */}
          <div className="relative h-9 w-32">
            <CalenderIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 z-10" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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

        {/* No Data State */}
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

  const getCurrentData = () => {
    if (!currentActivity || currentActivity === "All Activities") {
      return {
        plan: data.totalPlan,
        actual: data.totalActual,
        today: data.todayActual,
        percentage: data.percentage,
        deviation: data.deviation,
      };
    } else {
      const normalizedCurrent = normalizeActivityName(currentActivity);
      console.log('🔎 [MonthlyTarget] Looking for activity:', normalizedCurrent);
      console.log('📋 [MonthlyTarget] Available activities:', Object.keys(data.activityBreakdown));
      
      const activityKey = Object.keys(data.activityBreakdown).find(
        key => normalizeActivityName(key) === normalizedCurrent
      );
      
      if (activityKey) {
        const activityData = data.activityBreakdown[activityKey];
        const deviation = activityData.percentage - 100;
        console.log('✅ [MonthlyTarget] Found activity:', activityKey);
        console.log('📊 [MonthlyTarget] Activity todayActual:', activityData.todayActual);
        return {
          plan: activityData.plan,
          actual: activityData.actual,
          today: activityData.todayActual,
          percentage: activityData.percentage,
          deviation: deviation,
        };
      } else {
        console.warn('⚠️ [MonthlyTarget] Activity not found, using total');
      }
    }
    
    return {
      plan: data.totalPlan,
      actual: data.totalActual,
      today: data.todayActual,
      percentage: data.percentage,
      deviation: data.deviation,
    };
  };

  const currentData = getCurrentData();
  const series = [currentData.percentage];
  
  const options: ApexOptions = {
    colors: ["#F87171"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val.toFixed(2) + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#60A5FA"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const getMessage = () => {
    const averageFormatted = currentData.today.toLocaleString('id-ID');
    
    if (currentData.deviation >= 10) {
      return `Outstanding! Average ${averageFormatted} per day. Excellent performance!`;
    } else if (currentData.deviation >= 0) {
      return `Great work! Average ${averageFormatted} per day. Keep it up!`;
    } else if (currentData.deviation >= -10) {
      return `Average ${averageFormatted} per day. Almost there, keep pushing!`;
    } else {
      return `Average ${averageFormatted} per day. Let's improve together!`;
    }
  };

  return (
    <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out h-full flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex flex-col px-5 pt-5 bg-white shadow-default rounded-t-2xl dark:bg-gray-900 sm:px-6 sm:pt-6 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target - {data.site}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {currentActivity || "All Activities"}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Month Dropdown */}
            <div className="relative h-9 w-32">
              <CalenderIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 z-10" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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

        {/* Chart Area */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative transition-all duration-300 ease-in-out">
            <div className="max-h-[330px]" id="chartDarkStyle">
              <Chart
                key={`${selectedPT}-${currentActivity}-${chartKey}`}
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            </div>

            <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ease-in-out ${
              currentData.deviation >= 0 
                ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' 
                : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
            }`}>
              {currentData.deviation >= 0 ? '+' : ''}{currentData.deviation.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="py-6">
          <p className="mx-auto w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base transition-all duration-300 ease-in-out">
            {getMessage()}
          </p>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="flex items-center justify-center gap-5 px-6 py-4 sm:gap-8 sm:py-5 bg-white dark:bg-gray-900 rounded-b-2xl border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out">
        <div className="flex-1 max-w-[120px]">
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Plan
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {currentData.plan.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800 flex-shrink-0"></div>

        <div className="flex-1 max-w-[120px]">
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Actual
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {currentData.actual.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800 flex-shrink-0"></div>

        <div className="flex-1 max-w-[120px]">
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Average
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {currentData.today.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}