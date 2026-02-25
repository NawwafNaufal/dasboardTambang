import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

// Data harian Produktivity Index
const generateDailyData = (base: number, variance: number) =>
  Array.from({ length: 31 }, () =>
    parseFloat((base + (Math.random() - 0.5) * variance).toFixed(3))
  );

const dailyData = {
  lbgJam: generateDailyData(7.20,  2),
  mtrJam: generateDailyData(42.95, 8),
  ltrMtr: generateDailyData(0.816, 0.1),
};

const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
const months: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Ambil nilai terakhir (input terakhir bulan ini)
const lastValue = (arr: number[]) => arr[arr.length - 1];

// Hitung % perubahan dari nilai pertama ke terakhir
const pctChange = (arr: number[]) => {
  const first = arr[0];
  const last = arr[arr.length - 1];
  return (((last - first) / first) * 100).toFixed(0);
};

export default function DailyProduct() {
  const [selectedMonth, setSelectedMonth] = useState<Month>("Jan");
  const [isDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  const textColor = isDark ? "#aaaaaa" : "#6b7280";
  const gridColor = isDark ? "#2e2e33" : "#e5e7eb";

  const avg = (arr: number[], dec = 2) =>
    (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(dec);

  // Stats untuk header atas (mirip Authorized / Protected / Alerts)
  const stats = [
    {
      label: "lbg/jam",
      last: lastValue(dailyData.lbgJam).toFixed(2),
      pct: pctChange(dailyData.lbgJam),
      color: "#38BDF8",
      badgeBg: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300",
    },
    {
      label: "mtr/jam",
      last: lastValue(dailyData.mtrJam).toFixed(2),
      pct: pctChange(dailyData.mtrJam),
      color: "#34D399",
      badgeBg: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
    },
    {
      label: "ltr/mtr",
      last: lastValue(dailyData.ltrMtr).toFixed(4),
      pct: pctChange(dailyData.ltrMtr),
      color: "#FACC15",
      badgeBg: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300",
    },
  ];

  // Nilai besar di tengah = lbg/jam terakhir (nilai utama)
  const mainLast = lastValue(dailyData.lbgJam).toFixed(2);
  const mainPct  = pctChange(dailyData.lbgJam);
  const isPositive = Number(mainPct) >= 0;

  const summaries = [
    { label: "[lbg/jam]", value: avg(dailyData.lbgJam, 2), color: "text-sky-500",    bg: "bg-sky-50 dark:bg-sky-900/20",       border: "border-sky-200 dark:border-sky-800"     },
    { label: "[mtr/jam]", value: avg(dailyData.mtrJam, 2), color: "text-green-500",  bg: "bg-green-50 dark:bg-green-900/20",   border: "border-green-200 dark:border-green-800" },
    { label: "[ltr/mtr]", value: avg(dailyData.ltrMtr, 4), color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-200 dark:border-yellow-800" },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    stroke: { curve: "smooth", width: [2.5, 2.5, 2.5] },
    colors: ["#38BDF8", "#34D399", "#FACC15"],
    markers: { size: 0, hover: { size: 5 } },
    xaxis: {
      categories: days,
      labels: { style: { colors: textColor, fontSize: "11px" }, rotate: 0 },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: { text: "Hari", style: { color: textColor, fontSize: "11px" } },
    },
    yaxis: [
      {
        seriesName: "[lbg/jam]",
        min: 0, max: 15, tickAmount: 5,
        labels: { style: { colors: "#38BDF8", fontSize: "11px" }, formatter: (v) => v.toFixed(1) },
        title: { text: "lbg/jam", style: { color: "#38BDF8" } },
      },
      {
        seriesName: "[mtr/jam]",
        opposite: false, show: false, min: 0, max: 60,
      },
      {
        seriesName: "[ltr/mtr]",
        opposite: true, min: 0, max: 1.5, tickAmount: 5,
        labels: { style: { colors: "#FACC15", fontSize: "11px" }, formatter: (v) => v.toFixed(3) },
        title: { text: "ltr/mtr", style: { color: "#FACC15" } },
      },
    ],
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { top: -10, right: 10 } },
    legend: {
      show: true, position: "top", horizontalAlign: "right",
      labels: { colors: textColor }, markers: { size: 6 },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true, intersect: false,
      y: {
        formatter: (val, { seriesIndex }) => {
          if (seriesIndex === 0) return `${val.toFixed(2)} lbg/jam`;
          if (seriesIndex === 1) return `${val.toFixed(2)} mtr/jam`;
          return `${val.toFixed(4)} ltr/mtr`;
        },
      },
    },
  };

  const series = [
    { name: "[lbg/jam]", data: dailyData.lbgJam },
    { name: "[mtr/jam]", data: dailyData.mtrJam },
    { name: "[ltr/mtr]", data: dailyData.ltrMtr },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800 overflow-hidden">

      {/* ── TOP HEADER persis Auditlog Overview ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
        {/* Kiri: judul */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Produktivity Index
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Trend harian input terakhir bulan ini
          </p>
        </div>

        {/* Kanan: 3 stat pill (Authorized / Protected / Alerts style) */}
        <div className="flex items-center gap-6">
          {stats.map((s) => {
            const pos = Number(s.pct) >= 0;
            return (
              <div key={s.label} className="flex flex-col">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">
                  [{s.label}]
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    {s.last}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    pos
                      ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"
                  }`}>
                    {pos ? "+" : ""}{s.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: angka besar terakhir (lbg/jam) ── */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800">
        <p className="text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
          {mainLast}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Plan · {selectedMonth} 2026
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-green-400 text-white"
              : "bg-red-400 text-white"
          }`}>
            {isPositive ? "+" : ""}{mainPct}%
          </span>
        </div>
      </div>

      {/* ── BODY: summary + chart ── */}
      <div className="p-4 md:p-6">
        {/* Line Chart — tidak diubah sama sekali */}
        {/* @ts-ignore */}
        <Chart options={options} series={series} type="line" height={280} />

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2 space-y-3">
          {/* Month selector — tengah */}
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedMonth === m
                      ? "bg-brand-500 text-white"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}