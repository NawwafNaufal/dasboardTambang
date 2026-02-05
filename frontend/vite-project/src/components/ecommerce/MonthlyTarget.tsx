import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { CalenderIcon } from "../../icons";

interface ActivityBreakdown {
  [key: string]: {
    plan: number;
    actual: number;
    todayActual: number;  // ← Tambahkan todayActual di interface
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
        
        if (result.success) {
          setData(result.data);
          console.log('📊 [MonthlyTarget] Data loaded:', result.data);
        } else {
          setError(result.message || 'Failed to load data');
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
      <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out">
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400">{error || 'No data available'}</p>
            </div>
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
          today: activityData.todayActual,  // ← Gunakan todayActual dari activity spesifik, bukan data.todayActual
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
=======
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function MonthlyTarget() {
  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#465FFF"],
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
<<<<<<< HEAD
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
=======
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
<<<<<<< HEAD
          margin: 5,
=======
          margin: 5, // margin is in pixels
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
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
<<<<<<< HEAD
              return val.toFixed(2) + "%";
=======
              return val + "%";
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
<<<<<<< HEAD
      colors: ["#27b5f5"],
=======
      colors: ["#465FFF"],
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
<<<<<<< HEAD

  const getMonthName = (monthNum: number) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[monthNum - 1];
  };

  const getMessage = () => {
    const todayFormatted = currentData.today.toLocaleString('id-ID');
    
    if (currentData.deviation >= 10) {
      return `Outstanding! You earn ${todayFormatted} today. Excellent performance!`;
    } else if (currentData.deviation >= 0) {
      return `Great work! You earn ${todayFormatted} today. Keep it up!`;
    } else if (currentData.deviation >= -10) {
      return `You earn ${todayFormatted} today. Almost there, keep pushing!`;
    } else {
      return `You earn ${todayFormatted} today. Let's improve together!`;
    }
  };

  return (
    <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out h-full flex flex-col">
      {/* ✅ Main content area - flex-1 untuk mengisi ruang */}
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
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chart Area - flex-1 untuk mengisi ruang vertikal */}
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

        {/* Message - fixed spacing */}
        <div className="py-6">
          <p className="mx-auto w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base transition-all duration-300 ease-in-out">
            {getMessage()}
          </p>
        </div>
      </div>

      {/* ✅ Bottom stats - height fixed untuk konsistensi */}
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
=======
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You earn $3287 today, it's higher than last month. Keep up your good
          work!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Target
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            $20K
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                fill="#D92D20"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            $20K
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Today
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
<<<<<<< HEAD
            {currentData.today.toLocaleString('id-ID')}
=======
            $20K
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
          </p>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
