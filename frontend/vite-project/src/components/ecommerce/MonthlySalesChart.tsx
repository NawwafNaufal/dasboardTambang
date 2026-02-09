import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useRef } from "react";
import { MonthlySalesChartProps,SiteData,ApiResponse} from "@/interface/monthlySalesChart";

const ApexChart = Chart as any;

export default function MonthlySalesChart({ 
  selectedPT = "PT Semen Tonasa",
  apiUrl = "http://localhost:4000/api/monthly-actual/by-site", 
  year = 2026,  // ✅ Default ke 2026
  currentActivity
}: MonthlySalesChartProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiData, setApiData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState<string>("100%");
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Fungsi untuk format snake_case ke Title Case (untuk display)
  const formatActivityName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 [Chart] Fetching data for year:', year);
        const response = await fetch(`${apiUrl}?year=${year}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('✅ [Chart] API Response:', result);
        
        if (result.success) {
          setApiData(result.data);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        console.error("❌ [Chart] Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, year]);

  useEffect(() => {
    const updateChartWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setChartWidth(`${width}px`);
      }
    };

    updateChartWidth();

    const handleResize = () => {
      setTimeout(updateChartWidth, 150);
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateChartWidth, 150);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const mutationObserver = new MutationObserver(() => {
      setTimeout(updateChartWidth, 300);
    });

    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      subtree: false
    });

    const sidebarElement = document.querySelector('aside');
    if (sidebarElement) {
      mutationObserver.observe(sidebarElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Actual - {selectedPT} ({year})
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !apiData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Actual - {selectedPT} ({year})
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
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
              Belum ada data aktual untuk tahun {year}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Silakan tambahkan data melalui form input
            </p>
          </div>
        </div>
      </div>
    );
  }

  const availableSites = Object.keys(apiData);
  
  // ✅ TIDAK FALLBACK ke PT lain - langsung cek apakah selectedPT ada
  if (!apiData[selectedPT]) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Actual - {selectedPT} ({year})
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
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
              Belum ada data untuk {selectedPT} di tahun {year}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Silakan tambahkan data melalui form input
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentProducts = Object.keys(apiData[selectedPT]);
  
  console.log('🔍 [Chart] Current PT:', selectedPT);
  console.log('📦 [Chart] Available products (snake_case):', currentProducts);
  console.log('🎯 [Chart] Current activity from props (snake_case):', currentActivity);
  
  if (currentProducts.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Actual - {selectedPT} ({year})
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
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
              Belum ada produk untuk {selectedPT} di tahun {year}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Silakan tambahkan data melalui form input
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Langsung gunakan currentActivity untuk matching (sudah dalam format snake_case)
  const currentProductName = currentActivity && currentProducts.includes(currentActivity)
    ? currentActivity
    : currentProducts[0];
  
  console.log('✅ [Chart] Selected product:', currentProductName);
  
  const currentProductData = apiData[selectedPT][currentProductName];

  // Convert month data to values array
  const monthlyValues = currentProductData.map(item => item.value);
  
  // Month abbreviations
  const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const options: ApexOptions = {
    colors: ["#F87171", "#FB923C", "#FBBF24", "#FACC15", "#A3E635", "#4ADE80", "#2DD4BF", "#27b5f5", "#60A5FA", "#818CF8", "#C084FC", "#F472B6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: {
          position: 'top',
        },
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(2),
      offsetY: -18,
      style: {
        fontSize: '11px',
        fontWeight: 400,
        colors: [isDarkMode ? '#FFFFFF' : '#000000'],
        fontFamily: 'Outfit, sans-serif'
      },
      background: {
        enabled: false,
      }
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthAbbreviations,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      show: false,
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: currentProductName,
      data: monthlyValues,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Actual - {selectedPT} ({year})
        </h3>
      </div>

      {/* Product name - ✅ Format untuk display saja */}
      <div className="text-center mb-4 mt-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {formatActivityName(currentProductName)}
        </p>
      </div>

      <div ref={containerRef} className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ApexChart 
            key={`${selectedPT}-${currentProductName}-${year}-${chartWidth}`}
            options={options} 
            series={series} 
            type="bar" 
            height={180}
            width={chartWidth}
          />
        </div>
      </div>
    </div>
  );
}