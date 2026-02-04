import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useRef } from "react";

const ApexChart = Chart as any;

interface MonthlyData {
  month: string;
  value: number;
}

interface ActivityData {
  [activityName: string]: MonthlyData[];
}

interface SiteData {
  [siteName: string]: ActivityData;
}

interface ApiResponse {
  success: boolean;
  year: number;
  data: SiteData;
}

interface MonthlySalesChartProps {
  selectedPT?: string;
  apiUrl?: string;
  year?: number;
  currentActivity?: string;
}

export default function MonthlySalesChart({ 
  selectedPT = "PT Semen Tonasa",
  apiUrl = "http://localhost:4000/api/monthly-actual/by-site", 
  year = 2025,
  currentActivity
}: MonthlySalesChartProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiData, setApiData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState<string>("100%");
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data for year:', year);
        const response = await fetch(`${apiUrl}?year=${year}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('API Response:', result);
        
        if (result.success) {
          setApiData(result.data);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, year]);

  // Handle resize untuk chart responsiveness
  useEffect(() => {
    const updateChartWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setChartWidth(`${width}px`);
      }
    };

    // Initial update
    updateChartWidth();

    // Window resize listener
    const handleResize = () => {
      setTimeout(updateChartWidth, 150);
    };

    window.addEventListener('resize', handleResize);

    // ResizeObserver untuk detect perubahan ukuran container
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateChartWidth, 150);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // MutationObserver untuk detect class changes (sidebar toggle)
    const mutationObserver = new MutationObserver(() => {
      setTimeout(updateChartWidth, 300);
    });

    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      subtree: false
    });

    // Observer untuk <aside> atau sidebar element jika ada
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

  // Detect dark mode
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

  // Show loading state
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !apiData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 dark:text-red-400">
            Error: {error || "No data available"}
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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            No data available for {selectedPT} in year {year}
          </div>
        </div>
      </div>
    );
  }

  const currentProducts = Object.keys(apiData[currentPT]);
  
  if (currentProducts.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            No products available for {currentPT} in year {year}
          </div>
        </div>
      </div>
    );
  }

  const currentProductName = currentActivity && currentProducts.includes(currentActivity) 
    ? currentActivity 
    : currentProducts[0];
  
  const currentProductData = apiData[currentPT][currentProductName];

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
          Actual - {currentPT} ({year})
        </h3>
      </div>

      {/* Product name */}
      <div className="text-center mb-4 mt-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {currentProductName}
        </p>
      </div>

      <div ref={containerRef} className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ApexChart 
            key={`${currentPT}-${currentProductName}-${year}-${chartWidth}`}
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