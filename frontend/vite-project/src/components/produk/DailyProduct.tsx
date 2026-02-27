import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useRef, useMemo } from "react";

const ALL_UNITS = [
  "EPIROC-01","U.03","U.04","U.05","U.06","U.07","U.09","U.10","U.12","U.13",
  "U.16","U.17","U.19","U.20","U.23","U.39","U.40","U.41","U.50","U.51",
  "U.52","U.54","U.55","U.56","U.24","U.25","U.27","U.28","U.29","U.30",
  "U.31","U.32",
];

// ── Custom Single Select ───────────────────────────────
interface SingleSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({ options, value, onChange }) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref                 = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 px-5 py-1 rounded-xl min-w-[120px] justify-between border text-sm font-semibold transition-all ${
          open
            ? "border-brand-500 ring-2 ring-brand-100 bg-white text-brand-500 dark:bg-gray-800 dark:border-brand-400 dark:ring-brand-900/40 dark:text-brand-400"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        }`}
      >
        <span className="text-sm font-semibold text-brand-500 dark:text-brand-400">{value}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
          viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          className="text-gray-400"
        >
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          style={{ top: "calc(100% + 6px)", left: 0, minWidth: "160px" }}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#9ca3af" viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>
              </svg>
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari unit..."
                className="w-full pl-7 pr-6 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none"
                >×</button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }} className="py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400 text-center">Tidak ditemukan</div>
            )}
            {filtered.map((opt) => {
              const isActive = opt === value;
              return (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-brand-50 dark:bg-brand-900/30 text-brand-500 dark:text-brand-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="text-brand-500 flex-shrink-0">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  )}
                  {!isActive && <span style={{ width: 12 }} />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Data ───────────────────────────────────────────────
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
const months: Month[] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
type Tab = "productivity" | "fuel";

const lastValue = (arr: number[]) => arr[arr.length - 1];
const pctChange = (arr: number[]) => {
  const first = arr[0], last = arr[arr.length - 1];
  return (((last - first) / first) * 100).toFixed(0);
};

export default function DailyProduct() {
  const [tab,           setTab]           = useState<Tab>("productivity");
  const [selectedMonth, setSelectedMonth] = useState<Month>("Jan");
  const [selectedUnit,  setSelectedUnit]  = useState<string>(ALL_UNITS[0]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const [isDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const textColor = isDark ? "#aaaaaa" : "#6b7280";
  const gridColor = isDark ? "#2e2e33" : "#e5e7eb";

  const tabConfig = {
    productivity: {
      title: "Produktivity Index",
      stats: [
        { label: "Lbg/Jam", data: dailyData.lbgJam, dec: 2 },
        { label: "Mtr/Jam", data: dailyData.mtrJam, dec: 2 },
        { label: "Ltr/Mtr", data: dailyData.ltrMtr, dec: 4 },
      ],
      mainData: dailyData.lbgJam, mainDec: 2, mainLabel: "Lbg/Jam",
      mainColor: "text-brand-500 dark:text-brand-400",
      series: [
        { name: "Lbg/Jam", data: dailyData.lbgJam },
        { name: "Mtr/Jam", data: dailyData.mtrJam },
        { name: "Ltr/Mtr", data: dailyData.ltrMtr },
      ],
      colors: ["#38BDF8","#34D399","#FACC15"],
      yaxis: [
        { seriesName: "Lbg/Jam", min: 0, max: 15, tickAmount: 5, labels: { style: { colors: "#38BDF8", fontSize: "11px" }, formatter: (v: number) => v.toFixed(1) }, title: { text: "Lbg/Jam", style: { color: "#38BDF8" } } },
        { seriesName: "Mtr/Jam", opposite: false, show: false, min: 0, max: 60 },
        { seriesName: "Ltr/Mtr", opposite: true, min: 0, max: 1.5, tickAmount: 5, labels: { style: { colors: "#FACC15", fontSize: "11px" }, formatter: (v: number) => v.toFixed(3) }, title: { text: "Ltr/Mtr", style: { color: "#FACC15" } } },
      ],
      tooltipFormatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
        if (seriesIndex === 0) return `${val.toFixed(2)} lbg/jam`;
        if (seriesIndex === 1) return `${val.toFixed(2)} mtr/jam`;
        return `${val.toFixed(4)} ltr/mtr`;
      },
    },
    fuel: {
      title: "Fuel Consumption",
      stats: [{ label: "Ltr/Mtr", data: dailyData.ltrMtr, dec: 4 }],
      mainData: dailyData.ltrMtr, mainDec: 4, mainLabel: "Ltr/Mtr",
      mainColor: "text-orange-500 dark:text-orange-400",
      series: [{ name: "Ltr/Mtr", data: dailyData.ltrMtr }],
      colors: ["#F97316"],
      yaxis: [{ seriesName: "Ltr/Mtr", min: 0, max: 1.5, tickAmount: 5, labels: { style: { colors: "#F97316", fontSize: "11px" }, formatter: (v: number) => v.toFixed(3) }, title: { text: "Ltr/Mtr", style: { color: "#F97316" } } }],
      tooltipFormatter: (val: number) => `${val.toFixed(4)} ltr/mtr`,
    },
  };

  const cfg        = tabConfig[tab];
  const mainLast   = lastValue(cfg.mainData).toFixed(cfg.mainDec);
  const mainPct    = pctChange(cfg.mainData);
  const isPositive = Number(mainPct) >= 0;

  const options: ApexOptions = {
    chart: { type: "line", fontFamily: "Outfit, sans-serif", toolbar: { show: false }, background: "transparent", animations: { enabled: true, speed: 600 } },
    stroke: { curve: "smooth", width: [2.5, 2.5, 2.5] },
    colors: cfg.colors,
    markers: { size: 0, hover: { size: 5 } },
    xaxis: { categories: days, labels: { style: { colors: textColor, fontSize: "11px" }, rotate: 0 }, axisBorder: { show: false }, axisTicks: { show: false }, title: { text: "Hari", style: { color: textColor, fontSize: "11px" } } },
    yaxis: cfg.yaxis as ApexOptions["yaxis"],
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { top: -10, right: 10 } },
    legend: { show: true, position: "top", horizontalAlign: "right", labels: { colors: textColor }, markers: { size: 6 } },
    tooltip: { theme: isDark ? "dark" : "light", shared: true, intersect: false, y: { formatter: cfg.tooltipFormatter } },
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800 overflow-hidden">

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{cfg.title}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Trend harian input terakhir bulan ini</p>
        </div>
        <div className="flex items-center gap-6">
          {cfg.stats.map((s) => {
            const p = pctChange(s.data), pos = Number(p) >= 0;
            return (
              <div key={s.label} className="flex flex-col">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{lastValue(s.data).toFixed(s.dec)}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"}`}>
                    {pos ? "+" : ""}{p}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TAB ROW */}
      <div className="flex items-center justify-between px-6 border-t border-gray-200 dark:border-gray-700">

        {/* Kiri: custom unit select */}
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Unit:</span>
          <SingleSelect options={ALL_UNITS} value={selectedUnit} onChange={setSelectedUnit} />
        </div>

        {/* Kanan: tab */}
        <div className="flex">
          {(["productivity", "fuel"] as Tab[]).map((t) => {
            const active = tab === t;
            const icon = t === "productivity"
              ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z"/><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1c.564 0 1.034.11 1.402.328.37.22.64.546.79.97.295.836.205 1.987.2 3.182v.006l-.002 2.29a.5.5 0 0 1-.498.5H15v4.5a1.5 1.5 0 0 1-3 0V12a2 2 0 0 1-2-2V2zm9 0a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13h8zm-4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/></svg>;
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold underline-offset-4 transition-all ${active ? "underline decoration-2 decoration-brand-500 text-brand-500 dark:text-brand-400" : "no-underline text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
                {icon}{t === "productivity" ? "Productivity" : "Fuel"}
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800">
        <p className={`text-8xl tracking-tighter leading-none font-bold ${cfg.mainColor}`}>{mainLast}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-400 dark:text-gray-500">{cfg.mainLabel} · {selectedUnit} · {selectedMonth} 2026</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"}`}>
            {isPositive ? "+" : ""}{mainPct}%
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 md:p-6">
        {/* @ts-ignore */}
        <Chart options={options} series={cfg.series} type="line" height={280} />
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {months.map((m) => (
                <button key={m} onClick={() => setSelectedMonth(m)}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${selectedMonth === m ? "bg-brand-500 text-white" : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
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