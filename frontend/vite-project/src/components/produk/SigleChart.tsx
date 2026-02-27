import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const seriesData = [
  { name: "PA", data: [7, 8, 15, 18, 12, 10, 14, 9, 11, 13, 16, 8], color: "#F87171" },
  { name: "MA", data: [6, 8, 10, 14, 9, 7, 12, 8, 10, 11, 13, 7],   color: "#FCD34D" },
  { name: "UA", data: [5, 4, 5, 8, 6, 5, 7, 6, 5, 7, 9, 5],         color: "#86EFAC" },
  { name: "EU", data: [4, 6, 8, 11, 7, 6, 9, 5, 7, 8, 10, 6],       color: "#FCA5A5" },
];

export default function SyncKpiChart() {
  const options: ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true, speed: 350 },
      background: "transparent",
    },
    colors: seriesData.map((s) => s.color),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 3,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
        formatter: (v) => `${v}`,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 0,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      markers: { width: 10, height: 10, radius: 2 },
      labels: { colors: "#6B7280" },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (v) => `${v}` },
    },
  }), []);

  const series = seriesData.map((s) => ({ name: s.name, data: s.data }));

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800 flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bulanan — 2026</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">PA · MA · UA · EU</p>
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        {/* @ts-ignore */}
        <Chart options={options} series={series} type="bar" height={320} width="100%" />
      </div>
    </div>
  );
}