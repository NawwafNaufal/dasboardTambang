import { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CalenderIcon } from "../../icons";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const API_ENDPOINTS = {
  STATISTICS: '/api/static'
};

/* =========================
   TYPES & INTERFACES
========================= */
interface UnitDetail {
  unitName: string;
  plan?: number;
  actual: number;
  unit: string;
}

interface BreakdownDetail {
  day: number;
  dayName: string;
  date: string;
  units: UnitDetail[];
}

interface DailyData {
  day: number;
  dayName: string;
  date: string;
  actual: number;
  plan: number;
  rkap: number;
  ach: number;
  reason: string | null;
}

interface Note {
  day: number;
  dayName: string;
  date: string;
  reason: string;
}

interface ActivityData {
  activityName: string;
  plan: number;
  unit: string;
  dailyData: DailyData[];
  notes: Note[];
  breakdownDetails?: BreakdownDetail[];
}

interface ApiResponse {
  success: boolean;
  site: string;
  month: number;
  year: number;
  monthName: string;
  data: Record<string, ActivityData>;
}

interface StatisticsChartProps {
  selectedPT?: string;
}

/* =========================
   HELPER FUNCTIONS
========================= */
const getMonthNumber = (monthName: string): number => {
  const months: Record<string, number> = {
    "Januari": 1, "Februari": 2, "Maret": 3, "April": 4,
    "Mei": 5, "Juni": 6, "Juli": 7, "Agustus": 8,
    "September": 9, "Oktober": 10, "November": 11, "Desember": 12
  };
  return months[monthName] || 1;
};

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

/* =========================
   MAIN COMPONENT
========================= */
export default function StatisticsChart({ 
  selectedPT = "PT Semen Tonasa" 
}: StatisticsChartProps) {
  const [selectedDay, setSelectedDay] = useState<{ day: string; description: string; } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear] = useState(2026);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  /* =========================
     FETCH DATA FROM API
  ========================= */
  const fetchStatisticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const monthNumber = getMonthNumber(selectedMonth);
      const params = new URLSearchParams({
        site: selectedPT,
        month: monthNumber.toString(),
        year: selectedYear.toString()
      });

      const url = `${API_BASE_URL}${API_ENDPOINTS.STATISTICS}?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch statistics data: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }

      setApiData(data);

      if (data.data && Object.keys(data.data).length > 0) {
        if (!selectedCategory || !data.data[selectedCategory]) {
          const firstCategory = Object.keys(data.data)[0];
          setSelectedCategory(firstCategory);
        }
      } else {
        console.warn('No activity data available for this period');
      }

    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatisticsData();
  }, [selectedPT, selectedMonth, selectedYear]);

  useEffect(() => {
    if (apiData && selectedCategory && apiData.data[selectedCategory]) {
      const activity = apiData.data[selectedCategory];
      console.log('=== API Data Debug ===');
      console.log('Selected Category:', selectedCategory);
      console.log('Activity Data:', activity);
      console.log('Has breakdownDetails:', !!activity.breakdownDetails);
      if (activity.breakdownDetails) {
        console.log('Breakdown Details Length:', activity.breakdownDetails.length);
        console.log('First Breakdown Detail:', activity.breakdownDetails[0]);
      }
      console.log('====================');
    }
  }, [apiData, selectedCategory]);

  useEffect(() => {
    if (apiData && apiData.data) {
      const categories = Object.keys(apiData.data);
      if (categories.length > 0 && !categories.includes(selectedCategory)) {
        setSelectedCategory(categories[0]);
      }
    }
    setSelectedDay(null);
    setIsZoomed(false);
  }, [selectedPT]);

  /* =========================
     PREPARE CHART DATA
  ========================= */
  const prepareChartData = () => {
    if (!apiData || !apiData.data || !selectedCategory || !apiData.data[selectedCategory]) {
      return { days: [], targetData: [], actualData: [], targetValue: 0 };
    }

    const activity = apiData.data[selectedCategory];
    const monthNumber = getMonthNumber(selectedMonth);
    const daysInMonth = getDaysInMonth(monthNumber, selectedYear);
    
    const days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    
    const targetValue = activity.plan || 0;
    const targetData = Array(daysInMonth).fill(targetValue);
    
    const actualData = Array(daysInMonth).fill(null);
    activity.dailyData.forEach((dailyItem) => {
      const index = dailyItem.day - 1;
      if (index >= 0 && index < daysInMonth) {
        actualData[index] = dailyItem.actual;
      }
    });

    return { days, targetData, actualData, targetValue };
  };

  const { days, targetData, actualData, targetValue } = prepareChartData();

  /* =========================
     CHART CONFIGURATION
  ========================= */
  const series = useMemo(() => [
    {
      name: 'Target Plan',
      data: targetData,
    },
    {
      name: selectedCategory.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      data: actualData,
    },
  ], [targetData, actualData, selectedCategory]);

  const options: ApexOptions = useMemo(() => ({
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
      },
      events: {
        markerClick: (_event, _ctx, { dataPointIndex }) => {
          const day = days[dataPointIndex];
          const activity = apiData?.data[selectedCategory];
          
          if (activity) {
            const dailyItem = activity.dailyData.find(d => d.day === parseInt(day));
            
            if (dailyItem) {
              // Cek apakah ada reason yang tidak kosong
              if (dailyItem.reason && dailyItem.reason.trim() !== '') {
                setSelectedDay({
                  day,
                  description: dailyItem.reason
                });
              } else {
                // Jika tidak ada reason, tampilkan "Tidak ada keterangan"
                setSelectedDay({
                  day,
                  description: "Tidak ada keterangan"
                });
              }
            } else {
              // Jika tidak ada data untuk hari tersebut
              setSelectedDay({
                day,
                description: "Tidak ada keterangan"
              });
            }
          }
        },
        zoomed: (chartContext, { xaxis }) => {
          const range = xaxis.max - xaxis.min;
          setIsZoomed(range < 25);
        },
        beforeResetZoom: () => {
          setIsZoomed(false);
          return undefined;
        }
      },
    },
    colors: ["#ec6765", "#27b5f5"],
    stroke: { 
      curve: "straight", 
      width: [2, 2],
    },
    fill: { 
      type: ['solid', 'gradient'],
      gradient: { 
        opacityFrom: 0.5, 
        opacityTo: 0 
      },
      opacity: [0, 0.5]
    },
    markers: { 
      size: [0, 6],
      strokeWidth: 2, 
      strokeColors: "#fff", 
      colors: ["#ec6765", "#60A5FA"],
      hover: { size: [0, 9] } 
    },
    dataLabels: { 
      enabled: isZoomed,
      enabledOnSeries: [1],
      background: {
        enabled: true,
        foreColor: '#60A5FA',
        borderRadius: 4,
        padding: 4,
        opacity: 0.9,
        borderWidth: 0,
      },
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#ffffff']
      },
      offsetY: -10,
      formatter: function(value) {
        return value ? value.toString() : '';
      }
    },
    tooltip: { 
      enabled: true,
      intersect: false,
      shared: false,
      followCursor: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const day = days[dataPointIndex];
        const seriesName = w.globals.seriesNames[seriesIndex];
        const value = series[seriesIndex][dataPointIndex];
        
        if (seriesIndex === 0) {
          const activity = apiData?.data[selectedCategory];
          const unit = activity?.unit || '';
          
          return '<div style="padding: 10px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 160px;">' +
            '<div style="font-weight: 600; color: #ec6765; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">Target Plan</div>' +
            '<div style="display: flex; justify-content: space-between;">' +
            '<span style="color: #ec6765; font-weight: 600; font-size: 12px;">' + value.toLocaleString() + ' ' + unit + '</span>' +
            '</div>' +
            '</div>';
        }
        
        const activity = apiData?.data[selectedCategory];
        if (!activity) return '';
        
        const dailyItem = activity.dailyData.find(d => d.day === parseInt(day));
        if (!dailyItem) return '';
        
        const breakdownItem = activity.breakdownDetails?.find(b => b.day === parseInt(day));
        
        let html = '<div style="padding: 10px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 180px;">';
        html += '<div style="font-weight: 600; color: #60A5FA; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">';
        html += dailyItem.dayName + ', ' + day + ' ' + selectedMonth;
        html += '</div>';
        
        if (breakdownItem && breakdownItem.units && breakdownItem.units.length > 0) {
          html += '<div style="display: flex; flex-direction: column; gap: 4px;">';
          breakdownItem.units.forEach(unit => {
            html += '<div style="display: flex; justify-content: space-between; gap: 16px;">';
            html += '<span style="color: #6b7280; font-size: 12px;">' + unit.unitName + ':</span>';
            html += '<span style="color: #60A5FA; font-weight: 600; font-size: 12px;">' + unit.actual.toLocaleString() + ' ' + unit.unit + '</span>';
            html += '</div>';
          });
          html += '</div>';
        } else {
          html += '<div style="display: flex; justify-content: space-between;">';
          html += '<span style="color: #6b7280; font-size: 12px;">Total:</span>';
          html += '<span style="color: #60A5FA; font-weight: 600; font-size: 12px;">' + value + ' ' + activity.unit + '</span>';
          html += '</div>';
        }
        
        // Tambahkan keterangan jika ada reason
        if (dailyItem.reason && dailyItem.reason.trim() !== '') {
          html += '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">';
          html += '<div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">Keterangan:</div>';
          html += '<div style="font-size: 12px; color: #374151;">' + dailyItem.reason + '</div>';
          html += '</div>';
        }
        
        html += '</div>';
        return html;
      }
    },
    xaxis: { 
      categories: days, 
      axisBorder: { show: false }, 
      axisTicks: { show: false } 
    },
    yaxis: { 
      min: 0,
      tickAmount: 5,
      labels: { 
        show: true,
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
        },
        formatter: function(value) {
          return value.toFixed(0);
        }
      } 
    },
    legend: { 
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -10,
      markers: {
        width: 12,
        height: 12,
        radius: 2,
      },
    },
  }), [days, isZoomed, apiData, selectedCategory, selectedMonth]);

  /* =========================
     HANDLERS
  ========================= */
  const handleCategoryChange = (cat: string) => {
    const currentScrollY = window.scrollY;
    setSelectedCategory(cat);
    setSelectedDay(null);
    
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setSelectedDay(null);
  };

  /* =========================
     RENDER
  ========================= */
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500 dark:text-gray-400">Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center h-80">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Cek apakah ada data
  const hasData = apiData && apiData.data && Object.keys(apiData.data).length > 0;
  const categories = hasData ? Object.keys(apiData.data) : [];
  const currentActivity = hasData ? apiData.data[selectedCategory] : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Statistics - {apiData?.site || selectedPT}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasData ? (
              `${selectedCategory.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')} - ${selectedMonth}`
            ) : (
              `${selectedMonth} ${selectedYear}`
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Tabs - hanya tampil jika ada data */}
          {hasData && (
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-white text-gray-800 shadow-sm dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {cat.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </button>
              ))}
            </div>
          )}

          {/* Month Selector - SELALU tampil */}
          <div className="relative">
            <CalenderIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500" />
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="h-9 w-32 rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 appearance-none cursor-pointer"
            >
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
              <option value="Juli">Juli</option>
              <option value="Agustus">Agustus</option>
              <option value="September">September</option>
              <option value="Oktober">Oktober</option>
              <option value="November">November</option>
              <option value="Desember">Desember</option>
            </select>
          </div>
        </div>
      </div>

      {/* Konten - Chart atau No Data */}
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Tidak Ada Data
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum ada data operasional untuk {apiData?.site || selectedPT} di bulan {selectedMonth} {selectedYear}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Silakan pilih bulan lain atau tambahkan data melalui form input
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Chart */}
          <Chart 
            options={options} 
            series={series} 
            type="area" 
            height={310} 
          />

          {/* Display selected day info when marker is clicked */}
          {selectedDay && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Keterangan {(() => {
                  const activity = apiData?.data[selectedCategory];
                  if (activity) {
                    const dailyItem = activity.dailyData.find(d => d.day === parseInt(selectedDay.day));
                    if (dailyItem) {
                      return `${dailyItem.dayName}, ${selectedDay.day} ${selectedMonth}`;
                    }
                  }
                  return `Hari ke-${selectedDay.day}`;
                })()}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {selectedDay.description}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}