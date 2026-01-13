import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";

const ptData = {
  "Lamongan Shorebase": {
    name: "Lamongan Shorebase",
    products: {
      "Cotton Fields": [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  },
  "PT Semen Tonasa": {
    name: "PT Semen Tonasa",
    products: {
      "Loading Hauling": [220, 310, 250, 180, 290, 310, 270, 195, 240, 350, 305, 190],
      "Drilling": [280, 380, 310, 240, 350, 370, 330, 255, 300, 410, 365, 250],
      "Perintisan Used": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
      "Perintisan New": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
      "Bulldozer Used": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
      "Bulldozer New": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
      "Breaker": [195, 275, 220, 160, 255, 275, 235, 170, 210, 310, 270, 165],
    },
  },
  "PT Semen Padang": {
    name: "PT Semen Padang",
    products: {
      "Loading Hauling": [150, 280, 190, 320, 210, 240, 310, 150, 195, 370, 260, 140],
    },
  },
  "Site Omi Sale": {
    name: "Site Omi Sale",
    products: {
      "OB Rehandle": [195, 340, 220, 270, 200, 215, 285, 130, 225, 410, 295, 125],
      "OB Insitu": [230, 390, 265, 315, 245, 260, 335, 175, 270, 460, 345, 170],
      "ER": [165, 290, 185, 225, 170, 180, 240, 105, 190, 360, 250, 100],
      "PPO Direct": [165, 290, 185, 225, 170, 180, 240, 105, 190, 360, 250, 100],
    },
  },
};

export default function MonthlySalesChart() {
  const [selectedPT, setSelectedPT] = useState<keyof typeof ptData>("Site Omi Sale");
  const [isPTDropdownOpen, setIsPTDropdownOpen] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(2);

  const currentProducts = Object.keys(ptData[selectedPT].products);
  const currentProductName = currentProducts[currentProductIndex];
  const currentProductData = ptData[selectedPT].products[currentProductName as keyof typeof ptData[typeof selectedPT]["products"]];

  const options: ApexOptions = {
    colors: ["#465fff"],
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
      },
    },
    dataLabels: {
      enabled: false,
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
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
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

  function togglePTDropdown() {
    setIsPTDropdownOpen(!isPTDropdownOpen);
  }

  function closePTDropdown() {
    setIsPTDropdownOpen(false);
  }

  function selectPT(pt: keyof typeof ptData) {
    setSelectedPT(pt);
    setCurrentProductIndex(0);
    closePTDropdown();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {ptData[selectedPT].name}
          </h3>
          <div className="relative inline-block">
            <button 
              onClick={togglePTDropdown}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
            >
              Pilih PT
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={isPTDropdownOpen}
              onClose={closePTDropdown}
              className="w-48 p-2"
            >
              {Object.keys(ptData).map((pt) => (
                <DropdownItem
                  key={pt}
                  onItemClick={() => selectPT(pt as keyof typeof ptData)}
                  className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
                    selectedPT === pt 
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {pt}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
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
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}