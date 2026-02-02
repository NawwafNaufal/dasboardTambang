import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CalenderIcon } from "../../icons";

/* =========================
   KETERANGAN PER HARI
========================= */
const dayDescriptions: Record<string, string> = {
  "1": "Produksi awal minggu, alat berat belum optimal.",
  "2": "Peningkatan produksi dari shift pagi.",
  "3": "Cuaca kurang mendukung, produksi menurun.",
  "4": "Operasional normal, target tercapai.",
  "5": "Alat berat full operasional, hasil meningkat.",
  "6": "Shift malam berjalan optimal.",
  "7": "Maintenance ringan, produksi stabil.",
  "8": "Distribusi lancar, hasil konsisten.",
  "9": "Permintaan pasar meningkat.",
  "10": "Produksi stabil dengan performa tim baik.",
  "11": "Kinerja lapangan optimal.",
  "12": "Output tinggi sepanjang hari.",
  "13": "Operasional lancar tanpa kendala.",
  "14": "Produksi menurun karena logistik.",
  "15": "Evaluasi tengah bulan.",
  "16": "Produksi kembali meningkat.",
  "17": "Shift malam dominan.",
  "18": "Distribusi cepat dan efisien.",
  "19": "Permintaan tinggi dari klien.",
  "20": "Peak produksi mingguan.",
  "21": "Penyesuaian SDM dan alat.",
  "22": "Operasional stabil.",
  "23": "Sedikit kendala teknis.",
  "24": "Kendala terselesaikan.",
  "25": "Produksi kembali normal.",
  "26": "Permintaan mulai naik.",
  "27": "Output tinggi dan konsisten.",
  "28": "Persiapan penutupan bulan.",
  "29": "Produksi tinggi karena permintaan meningkat.",
  "30": "Penutupan bulan & rekap produksi.",
};

/* =========================
   DATA DETAIL PER HARI & UNIT
========================= */
// Unit details untuk setiap kategori
const unitsByCategory: Record<string, string[]> = {
  "Loading Hauling": ["DT-10", "DT-15", "DT-20"],
  "Drilling": ["DR-01", "DR-05", "DR-08"],
  "Blasting": ["BL-03", "BL-07", "BL-12"],
  "Perintisan": ["PR-02", "PR-06", "PR-09"],
  "Bulldozer": ["BD-04", "BD-11", "BD-13"],
  "Breaker": ["BK-01", "BK-03", "BK-05"],
  "OB Rehandle": ["RH-02", "RH-07", "RH-10"],
  "OB Insitu": ["IN-03", "IN-08", "IN-11"],
};

// Helper function to generate unit details based on category and day
const generateUnitDetails = (category: string, dayNum: number, totalValue: number): { label: string; value: string }[] => {
  const units = unitsByCategory[category] || ["UNIT-01", "UNIT-02", "UNIT-03"];
  
  // Distribute nilai ke unit dengan variasi yang konsisten berdasarkan seed
  const baseValue = Math.floor(totalValue / units.length);
  const remainder = totalValue % units.length;
  
  return units.map((unit, index) => {
    // Gunakan formula deterministik berdasarkan index dan dayNum untuk konsistensi
    const seed = (dayNum * 7 + index * 3) % 50;
    const variation = seed - 25; // Variasi antara -25 hingga 24
    const value = baseValue + (index < remainder ? 1 : 0) + variation;
    return {
      label: unit,
      value: Math.max(0, value).toString()
    };
  });
};

// Helper function to get day name
const getDayName = (dayNum: number): string => {
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  // Asumsikan hari 1 adalah Senin
  return dayNames[(dayNum % 7)];
};

// Helper function to get day details with default values
const getDayDetails = (dayNum: string, category: string, actualValue: number) => {
  const dayNumber = parseInt(dayNum);
  return {
    dayNumber: dayNum,
    day: getDayName(dayNumber),
    actual: actualValue,
    details: generateUnitDetails(category, dayNumber, actualValue),
  };
};

/* =========================
   DATA PER PT & KATEGORI
========================= */
const ptData: Record<string, Record<string, number[]>> = {
  "PT Semen Tonasa": {
    "Loading Hauling": [1000, 3120, 2850, 3250, 3400, 3050, 3180, 3350, 3500, 3200, 3300, 3450, 3250, 3150, 3050, 2950, 3200, 3400, 3550, 3650, 3500, 3400, 3250, 3150, 3050, 2950, 3200, 3400, 3550, 3650],
    "Drilling": [2500, 2650, 2400, 2800, 2950, 2700, 2850, 3000, 3150, 2900, 3050, 3200, 2950, 2850, 2750, 2650, 2900, 3100, 3250, 3400, 3250, 3100, 2950, 2850, 2750, 2650, 2900, 3100, 3250, 3400],
    "Blasting": [1800, 1950, 1700, 2100, 2250, 2000, 2150, 2300, 2450, 2200, 2350, 2500, 2250, 2150, 2050, 1950, 2200, 2400, 2550, 2700, 2550, 2400, 2250, 2150, 2050, 1950, 2200, 2400, 2550, 2700],
  },
  "PT Semen Padang": {
    "Loading Hauling": [2200, 2350, 2500, 2650, 2800, 2550, 2400, 2750, 2900, 2650, 2800, 2950, 2850, 2750, 2650, 2450, 2800, 2950, 3100, 3200, 3000, 2850, 2750, 2650, 2550, 2750, 2900, 3050, 3150, 3300],
    "Drilling": [2000, 2150, 2300, 2450, 2600, 2350, 2200, 2550, 2700, 2450, 2600, 2750, 2650, 2550, 2450, 2250, 2600, 2750, 2900, 3000, 2800, 2650, 2550, 2450, 2350, 2550, 2700, 2850, 2950, 3100],
    "Perintisan": [1600, 1750, 1900, 2050, 2200, 1950, 1800, 2150, 2300, 2050, 2200, 2350, 2250, 2150, 2050, 1850, 2200, 2350, 2500, 2600, 2400, 2250, 2150, 2050, 1950, 2150, 2300, 2450, 2550, 2700],
    "Bulldozer": [1900, 2050, 2200, 2350, 2500, 2250, 2100, 2450, 2600, 2350, 2500, 2650, 2550, 2450, 2350, 2150, 2500, 2650, 2800, 2900, 2700, 2550, 2450, 2350, 2250, 2450, 2600, 2750, 2850, 3000],
  },
  "Lamongan Shorebase": {
    "Loading Hauling": [1800, 1900, 2000, 2150, 2300, 2050, 1900, 2250, 2400, 2150, 2300, 2450, 2350, 2250, 2150, 1950, 2300, 2450, 2600, 2700, 2500, 2350, 2250, 2150, 2050, 2250, 2400, 2550, 2650, 2800],
    "Drilling": [1600, 1700, 1800, 1950, 2100, 1850, 1700, 2050, 2200, 1950, 2100, 2250, 2150, 2050, 1950, 1750, 2100, 2250, 2400, 2500, 2300, 2150, 2050, 1950, 1850, 2050, 2200, 2350, 2450, 2600],
    "Breaker": [1200, 1300, 1400, 1550, 1700, 1450, 1300, 1650, 1800, 1550, 1700, 1850, 1750, 1650, 1550, 1350, 1700, 1850, 2000, 2100, 1900, 1750, 1650, 1550, 1450, 1650, 1800, 1950, 2050, 2200],
  },
  "UTSG": {
    "Loading Hauling": [3500, 3700, 3900, 4100, 4350, 4000, 3700, 4200, 4400, 4100, 4300, 4500, 4350, 4200, 4000, 3700, 4200, 4400, 4600, 4800, 4600, 4400, 4200, 4000, 3850, 4100, 4300, 4500, 4650, 4850],
    "Drilling": [3200, 3400, 3600, 3800, 4050, 3700, 3400, 3900, 4100, 3800, 4000, 4200, 4050, 3900, 3700, 3400, 3900, 4100, 4300, 4500, 4300, 4100, 3900, 3700, 3550, 3800, 4000, 4200, 4350, 4550],
    "OB Rehandle": [2800, 3000, 3200, 3400, 3650, 3300, 3000, 3500, 3700, 3400, 3600, 3800, 3650, 3500, 3300, 3000, 3500, 3700, 3900, 4100, 3900, 3700, 3500, 3300, 3150, 3400, 3600, 3800, 3950, 4150],
    "OB Insitu": [2900, 3100, 3300, 3500, 3750, 3400, 3100, 3600, 3800, 3500, 3700, 3900, 3750, 3600, 3400, 3100, 3600, 3800, 4000, 4200, 4000, 3800, 3600, 3400, 3250, 3500, 3700, 3900, 4050, 4250],
  },
};

interface StatisticsChartProps {
  selectedPT?: string;
}

export default function StatisticsChart({ selectedPT = "PT Semen Tonasa" }: StatisticsChartProps) {
  const [selectedDay, setSelectedDay] = useState<{ day: string; description: string; } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  
  const currentPT = selectedPT && ptData[selectedPT] ? selectedPT : "PT Semen Tonasa";
  const categories = Object.keys(ptData[currentPT]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Reset category ketika PT berubah
  useEffect(() => {
    const newCategories = Object.keys(ptData[currentPT]);
    setSelectedCategory(newCategories[0]);
    setSelectedDay(null);
    setIsZoomed(false);
  }, [currentPT]);

  const days = Array.from({ length: 30 }, (_, i) => `${i + 1}`);

  // Target/Plan value for each PT and category
  const targetValues: Record<string, Record<string, number>> = {
    "PT Semen Tonasa": {
      "Loading Hauling": 3300,
      "Drilling": 2900,
      "Blasting": 2200,
    },
    "PT Semen Padang": {
      "Loading Hauling": 2800,
      "Drilling": 2600,
      "Perintisan": 2200,
      "Bulldozer": 2500,
    },
    "Lamongan Shorebase": {
      "Loading Hauling": 2300,
      "Drilling": 2100,
      "Breaker": 1700,
    },
    "UTSG": {
      "Loading Hauling": 4200,
      "Drilling": 4000,
      "OB Rehandle": 3600,
      "OB Insitu": 3700,
    },
  };

  const targetValue = targetValues[currentPT]?.[selectedCategory] || 3000;
  const targetData = Array(30).fill(targetValue);

  const series = [
    {
      name: 'Target Plan',
      data: targetData,
    },
    {
      name: selectedCategory,
      data: ptData[currentPT][selectedCategory],
    },
  ];

  const options: ApexOptions = {
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
          setSelectedDay({
            day,
            description: dayDescriptions[day] ?? "Tidak ada keterangan untuk hari ini.",
          });
        },
        zoomed: (chartContext, { xaxis }) => {
          // Deteksi zoom berdasarkan range yang ditampilkan
          const range = xaxis.max - xaxis.min;
          
          // Jika menampilkan kurang dari 25 hari, aktifkan data labels
          if (range < 25) {
            setIsZoomed(true);
          } else {
            setIsZoomed(false);
          }
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
      opacity: [0, 0.5] // No fill for target line, gradient fill for actual data
    },
    markers: { 
      size: [0, 6], // No markers for target line, markers for actual data
      strokeWidth: 2, 
      strokeColors: "#fff", 
      colors: ["#ec6765", "#60A5FA"],
      hover: { size: [0, 9] } 
    },
    dataLabels: { 
      enabled: isZoomed,
      enabledOnSeries: [1], // Hanya untuk series actual (index 1)
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
        return value.toString();
      }
    },
    tooltip: { 
      enabled: true,
      custom: function({ seriesIndex, dataPointIndex, w }) {
        // seriesIndex 0 is target line, seriesIndex 1 is actual data
        if (seriesIndex === 1) {
          const day = days[dataPointIndex];
          const actualValue = w.globals.series[seriesIndex][dataPointIndex];
          const dayDetails = getDayDetails(day, selectedCategory, actualValue);
          
          return `
            <div style="background: white; padding: 8px 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-width: 140px;">
              <div style="font-weight: 600; color: #29b4f4; margin-bottom: 6px; font-size: 12px;">
                ${dayDetails.day}, ${dayDetails.dayNumber} ${selectedMonth}
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                ${dayDetails.details.map(detail => `
                  <div style="display: flex; font-size: 12px;">
                    <span style="color: #374151; font-weight: 500;">${detail.label}</span>
                    <span style="color: #29b4f4; font-weight: 600;">${detail.value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          // Simple tooltip for target line
          const targetValue = w.globals.series[seriesIndex][dataPointIndex];
          return `
            <div style="background: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-weight: 600; color: #ec6765; font-size: 13px;">
                Target Plan: ${targetValue}
              </div>
            </div>
          `;
        }
      }
    },
    xaxis: { categories: days, axisBorder: { show: false }, axisTicks: { show: false } },
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
          // Return value as-is, ApexCharts will handle the intervals
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
  };

  // Handler untuk mengganti kategori tanpa scroll ke atas
  const handleCategoryChange = (cat: string) => {
    const currentScrollY = window.scrollY;
    setSelectedCategory(cat);
    
    // Restore scroll position setelah render
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Statistics - {currentPT}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedCategory} - {selectedMonth}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat
                    ? "bg-white text-gray-800 shadow-sm dark:bg-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <CalenderIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
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

      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={310} 
      />

      {selectedDay && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Keterangan Hari ke-{selectedDay.day}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedDay.description}
          </p>
        </div>
      )}
    </div>
  );
}