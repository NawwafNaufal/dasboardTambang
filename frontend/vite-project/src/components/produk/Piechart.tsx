import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

export default function DonutJamChart() {
  const [isDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  const operasi = 604;
  const stb     = 118;
  const bd      = 6;
  const total   = operasi + stb + bd;

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#60A5FA", "#FACC15", "#F87171"],
    labels: ["Operasi", "Standby (STB)", "Breakdown (BD)"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Jam",
              fontSize: "13px",
              color: isDark ? "#aaaaaa" : "#6b7280",
              formatter: () => `${total} jam`,
            },
            value: {
              fontSize: "22px",
              fontWeight: 700,
              color: isDark ? "#ffffff" : "#111827",
              formatter: (val) => `${val} jam`,
            },
          },
        },
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (val) => `${val} jam (${((val / total) * 100).toFixed(1)}%)` },
    },
  };

  const series = [operasi, stb, bd];

  const legends = [
    { label: "Operasi",         value: operasi, pct: ((operasi / total) * 100).toFixed(1), color: "bg-blue-400"  },
    { label: "Standby (STB)",   value: stb,     pct: ((stb / total) * 100).toFixed(1),     color: "bg-yellow-400" },
    { label: "Breakdown (BD)",  value: bd,       pct: ((bd / total) * 100).toFixed(1),       color: "bg-red-400"   },
  ];

  return (
    <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">

      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Distribusi Jam</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {total} <span className="text-sm font-normal text-gray-400">jam</span>
          </p>
        </div>
        <span className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
          <svg className="w-3.5 h-3.5 me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" />
          </svg>
          Januari 2026
        </span>
      </div>

      {/* Donut Chart */}
      {/* @ts-ignore */}
      <Chart options={options} series={series} type="donut" height={260} />

      {/* Legend custom */}
      <div className="mt-4 space-y-2">
        {legends.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.value} jam</span>
              <span className="text-xs text-gray-400 w-10 text-right">{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <span className="text-xs text-gray-400">Operasi + STB + BD = {total} jam</span>
        <a href="#" className="inline-flex items-center text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline">
          Detail Report
          <svg className="w-4 h-4 ms-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
          </svg>
        </a>
      </div>
    </div>
  );
}