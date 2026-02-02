import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";

const ptData = {
  "PT Semen Tonasa": {
    name: "PT Semen Tonasa",
    products: {
      "Cotton Fields": [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
      "Loading Hauling": [220, 310, 250, 180, 290, 310, 270, 195, 240, 350, 305, 190],
    },
  },
  "PT Semen Padang": {
    name: "PT Semen Padang",
    products: {
      "Drilling": [280, 380, 310, 240, 350, 370, 330, 255, 300, 410, 365, 250],
      "Perintisan Used": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
      "Bulldozer New": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
    },
  },
  "Lamongan Shorebase": {
    name: "Lamongan Shorebase",
    products: {
      "Loading Hauling": [150, 280, 190, 320, 210, 240, 310, 150, 195, 370, 260, 140],
      "Breaker": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
    },
  },
  "UTSG": {
    name: "UTSG",
    products: {
      "OB Rehandle": [195, 340, 220, 270, 200, 215, 285, 130, 225, 410, 295, 125],
      "OB Insitu": [230, 390, 265, 315, 245, 260, 335, 175, 270, 460, 345, 170],
      "ER": [165, 290, 185, 225, 170, 180, 240, 105, 190, 360, 250, 100],
      "PPO Direct": [165, 290, 185, 225, 170, 180, 240, 105, 190, 360, 250, 100],
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ApexChart = Chart as any;

interface MonthlySalesChartProps {
  selectedPT?: string;
}

export default function MonthlySalesChart({ selectedPT = "PT Semen Tonasa" }: MonthlySalesChartProps) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Reset product index when PT changes
  useEffect(() => {
    setCurrentProductIndex(0);
  }, [selectedPT]);

  const currentPT = selectedPT && ptData[selectedPT as keyof typeof ptData] ? selectedPT as keyof typeof ptData : "PT Semen Tonasa";
  const currentProducts = Object.keys(ptData[currentPT].products);
  const currentProductName = currentProducts[currentProductIndex];
  const currentProductData = ptData[currentPT].products[currentProductName as keyof typeof ptData[typeof currentPT]["products"]];

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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
      data: currentProductData,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Actual - {ptData[currentPT].name}
          </h3>
        </div>
        
        {/* Slide Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentProductIndex((prev) => prev === 0 ? currentProducts.length - 1 : prev - 1)}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Previous product"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentProductIndex((prev) => prev === currentProducts.length - 1 ? 0 : prev + 1)}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Next product"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product name */}
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {currentProductName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {currentProductIndex + 1} / {currentProducts.length}
        </p>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ApexChart 
            key={`${currentPT}-${currentProductIndex}`}
            options={options} 
            series={series} 
            type="bar" 
            height={180} 
          />
        </div>
      </div>
    </div>
  );
}