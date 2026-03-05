import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function ProductionChart() {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState("Last 7 days");

  const totalLbg = 4348;
  const unit1Lbg = 2115;
  const unit2Lbg = 2233;

  const options: ApexOptions = {
    series: [
      {
        name: "LBG (bcm)",
        color: "#007A55",
        data: [2115, 2300, 2050, 2200, 2400, 1950],
      },
      {
        name: "MTR (m)",
        color: "#C70036",
        data: [12962, 13200, 12800, 13000, 13400, 12600],
      },
    ],
    chart: {
      sparkline: { enabled: false },
      type: "bar",
      width: "100%",
      height: 400,
      toolbar: { show: false },
      background: "transparent",
    },
    fill: { opacity: 1 },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "100%",
        borderRadiusApplication: "end",
        borderRadius: 6,
        dataLabels: { position: "top" },
      },
    },
    legend: { show: true, position: "bottom" },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      labels: {
        show: true,
        style: { fontFamily: "Outfit, sans-serif", fontSize: "12px" },
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: { fontFamily: "Outfit, sans-serif", fontSize: "12px" },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: { left: 2, right: 2, top: -20 },
    },
  };

  const dropdownItems = ["Yesterday", "Today", "Last 7 days", "Last 30 days", "Last 90 days"];

  return (
    <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">

      {/* Header */}
      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
        <dl>
          <dt className="text-sm text-gray-500 dark:text-gray-400">Total LBG</dt>
          <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
            {totalLbg.toLocaleString()} <span className="text-sm font-normal text-gray-400">bcm</span>
          </dd>
        </dl>
        <div>
          <span className="inline-flex items-center bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 text-xs font-medium px-1.5 py-0.5 rounded">
            <svg className="w-4 h-4 me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v13m0-13 4 4m-4-4-4 4" />
            </svg>
            LBG rate 23.5%
          </span>
        </div>
      </div>

      {/* Sub stats */}
      <div className="grid grid-cols-2 py-3">
        <dl>
          <dt className="text-sm text-gray-500 dark:text-gray-400">Unit 1 LBG</dt>
          <dd className="text-lg font-semibold text-green-700 dark:text-green-400">
            {unit1Lbg.toLocaleString()}
          </dd>
        </dl>
        <dl>
          <dt className="text-sm text-gray-500 dark:text-gray-400">Unit 2 LBG</dt>
          <dd className="text-lg font-semibold text-red-600 dark:text-red-400">
            {unit2Lbg.toLocaleString()}
          </dd>
        </dl>
      </div>

      {/* Chart */}
      {/* @ts-ignore */}
      <Chart options={options} series={options.series} type="bar" height={400} />

      {/* Footer */}
      <div className="grid grid-cols-1 items-center border-t border-gray-200 dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-4 md:pt-6">

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-center inline-flex items-center"
              type="button"
            >
              {period}
              <svg className="w-4 h-4 ms-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute bottom-8 z-10 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-lg w-44">
                <ul className="p-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {dropdownItems.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => { setPeriod(item); setOpen(false); }}
                        className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded text-left"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Link */}
          <a
            href="#"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm px-3 py-2 rounded-xl focus:outline-none"
          >
            Production Report
            <svg className="w-4 h-4 ms-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
            </svg>
          </a>

        </div>
      </div>
    </div>
  );
}