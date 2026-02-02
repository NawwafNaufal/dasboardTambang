import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

/* =========================
   DATA PER PT
========================= */
const ptData: Record<string, {
  progress: number;
  target: string;
  revenue: string;
  today: string;
  targetChange: number;
  revenueChange: number;
  todayChange: number;
  earningsToday: string;
  message: string;
}> = {
  "PT Semen Tonasa": {
    progress: 75.55,
    target: "2057",
    revenue: "1537",
    today: "3.200",
    targetChange: -10,
    revenueChange: 15,
    todayChange: 8,
    earningsToday: "3,287",
    message: "You earn 3,287 today, it's higher than last month. Keep up your good work!"
  },
  "PT Semen Padang": {
    progress: 82.3,
    target: "25",
    revenue: "20",
    today: "4.5",
    targetChange: 5,
    revenueChange: 20,
    todayChange: 12,
    earningsToday: "4,500",
    message: "Excellent performance! PT B exceeded expectations with 4,500 today."
  },
  "Lamongan Shorebase": {
    progress: 68.7,
    target: "18",
    revenue: "12",
    today: "2.8",
    targetChange: -5,
    revenueChange: 10,
    todayChange: 5,
    earningsToday: "2,800",
    message: "PT C showing steady growth with 2,800 earned today. Room for improvement!"
  },
  "UTSG": {
    progress: 91.2,
    target: "30",
    revenue: "27",
    today: "5.5",
    targetChange: 15,
    revenueChange: 25,
    todayChange: 18,
    earningsToday: "5,500",
    message: "Outstanding! PT D is leading with 5,500 today. Amazing work!"
  },
};

interface MonthlyTargetProps {
  selectedPT?: string;
}

export default function MonthlyTarget({ selectedPT = "PT Semen Tonasa" }: MonthlyTargetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentPT = selectedPT && ptData[selectedPT] ? selectedPT : "PT Semen Tonasa";
  const data = ptData[currentPT];

  const series = [data.progress];
  
  const options: ApexOptions = {
    colors: ["#F87171"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
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
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#27b5f5"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-[100px]
 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target - {currentPT}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Target you've set for each month
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
              key={currentPT}
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
            data.targetChange >= 0 
              ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' 
              : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
          }`}>
            {data.targetChange >= 0 ? '+' : ''}{data.targetChange}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {data.message}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Plan
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {data.target}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Actual
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {data.revenue}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Today
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {data.today}
          </p>
        </div>
      </div>
    </div>
  );
}