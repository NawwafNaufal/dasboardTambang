import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext } from "react-router";
import { useSidebar } from "../../context/SidebarContext";

const BASE_URL = "https://moa2.site/api/api";

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
const months: Month[] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
type Tab = "productivity" | "fuel";

interface SingleSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 px-5 py-1 rounded-xl min-w-[120px] justify-between border text-sm font-semibold transition-all ${
          open
            ? "border-[#fd9141] ring-2 ring-orange-100 bg-white text-[#fd9141] dark:bg-gray-800 dark:border-[#fd9141] dark:ring-orange-900/40 dark:text-[#fd9141]"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        }`}
      >
        <span className="text-sm font-semibold text-[#fd9141]">{value || "Pilih Unit"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          className="text-gray-400">
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          style={{ top: "calc(100% + 6px)", left: 0, minWidth: "160px" }}>
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#9ca3af" viewBox="0 0 16 16"
                className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>
              </svg>
              <input ref={inputRef} value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari unit..."
                className="w-full pl-7 pr-6 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-[#fd9141] focus:ring-2 focus:ring-orange-100 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none">×</button>
              )}
            </div>
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }} className="py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400 text-center">Tidak ditemukan</div>
            )}
            {filtered.map((opt) => {
              const isActive = opt === value;
              return (
                <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-orange-50 dark:bg-orange-900/30 text-[#fd9141] font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>
                  {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ color: "#fd9141" }} className="flex-shrink-0">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  ) : <span style={{ width: 12 }} />}
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

const pctChange = (arr: number[]) => {
  if (arr.length < 2) return "0";
  const first = arr[0], last = arr[arr.length - 1];
  if (first === 0) return "0";
  return (((last - first) / first) * 100).toFixed(0);
};

interface DailyState {
  lbgJam: number[];
  mtrJam: number[];
  ltrMtr: number[];
  fuel: number[];
  plan: number;
  days: string[];
  summary: {
    totalFuel: number;
    totalLbgJam: number;
    totalMtrJam: number;
    totalLtrMtr: number;
  };
}

const EMPTY_STATE: DailyState = {
  lbgJam: [], mtrJam: [], ltrMtr: [], fuel: [],
  plan: 0, days: [],
  summary: { totalFuel: 0, totalLbgJam: 0, totalMtrJam: 0, totalLtrMtr: 0 }
};

export default function DailyProduct() {
  const { selectedPT, currentUnitActivity } = useOutletContext<{
    selectedPT: string;
    currentUnitActivity: string;
  }>();

  const [tab, setTab] = useState<Tab>("productivity");
  const [selectedMonth, setSelectedMonth] = useState<Month>(months[new Date().getMonth()]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [units, setUnits] = useState<string[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [dailyData, setDailyData] = useState<DailyState>(EMPTY_STATE);
  const [loadingData, setLoadingData] = useState(false);

  const { isExpanded, isHovered } = useSidebar();

  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event("resize")), 350);
    return () => clearTimeout(timer);
  }, [isExpanded, isHovered]);

  const [isDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const textColor = isDark ? "#aaaaaa" : "#6b7280";
  const gridColor = isDark ? "#2e2e33" : "#e5e7eb";

  useEffect(() => {
    if (!selectedPT || !currentUnitActivity) return;
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        const res = await fetch(
          `${BASE_URL}/units?site=${encodeURIComponent(selectedPT)}&activity=${encodeURIComponent(currentUnitActivity)}`
        );
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setUnits(result.data);
          setSelectedUnit(result.data[0]);
        } else {
          setUnits([]);
          setSelectedUnit("");
        }
      } catch {
        setUnits([]);
      } finally {
        setLoadingUnits(false);
      }
    };
    fetchUnits();
  }, [selectedPT, currentUnitActivity]);

  useEffect(() => {
    if (!selectedPT || !currentUnitActivity || !selectedUnit) return;
    const monthIdx = months.indexOf(selectedMonth) + 1;
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const res = await fetch(
          `${BASE_URL}/daily-productivity?site=${encodeURIComponent(selectedPT)}&activity=${encodeURIComponent(currentUnitActivity)}&year=2026&month=${monthIdx}&unit=${encodeURIComponent(selectedUnit)}`
        );
        const result = await res.json();
        if (result.success && result.data.daily.length > 0) {
          const raw = result.data.daily;
          const s = result.data.summary;
          setDailyData({
            lbgJam: raw.map((d: any) => d.lbgJam),
            mtrJam: raw.map((d: any) => d.mtrJam),
            ltrMtr: raw.map((d: any) => d.ltrMtr),
            fuel:   raw.map((d: any) => d.fuel),
            plan:   s.plan,
            days:   raw.map((d: any) => `${d.day}`),
            summary: {
              totalFuel:   s.totalFuel,
              totalLbgJam: s.totalLbgJam,
              totalMtrJam: s.totalMtrJam,
              totalLtrMtr: s.totalLtrMtr,
            }
          });
        } else {
          setDailyData(EMPTY_STATE);
        }
      } catch {
        setDailyData(EMPTY_STATE);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [selectedPT, currentUnitActivity, selectedUnit, selectedMonth]);

  const tabConfig = useMemo(() => ({
    productivity: {
      title: "Produktivity Index",
      stats: [
        { label: "Lbg/Jam", value: dailyData.summary.totalLbgJam, dec: 2, data: dailyData.lbgJam },
        { label: "Mtr/Jam", value: dailyData.summary.totalMtrJam, dec: 2, data: dailyData.mtrJam },
        { label: "Ltr/Mtr", value: dailyData.summary.totalLtrMtr, dec: 4, data: dailyData.ltrMtr },
      ],
      mainData: dailyData.lbgJam,
      mainDec: 2,
      mainLabel: "Lbg/Jam",
      mainColor: "text-[#fd9141]",
      series: [
        { name: "Lbg/Jam", data: dailyData.lbgJam },
        { name: "Mtr/Jam", data: dailyData.mtrJam },
        { name: "Ltr/Mtr", data: dailyData.ltrMtr },
      ],
      colors: ["#fd9141","#34D399","#FACC15"],
      yaxis: [
        {
          seriesName: "Lbg/Jam", min: 0, tickAmount: 5,
          labels: { style: { colors: "#fd9141", fontSize: "11px" }, formatter: (v: number) => v.toFixed(1) },
          title: { text: "Lbg/Jam", style: { color: "#fd9141" } }
        },
        { seriesName: "Mtr/Jam", opposite: false, show: false, min: 0 },
        {
          seriesName: "Ltr/Mtr", opposite: true, min: 0, tickAmount: 5,
          labels: { style: { colors: "#FACC15", fontSize: "11px" }, formatter: (v: number) => v.toFixed(3) },
          title: { text: "Ltr/Mtr", style: { color: "#FACC15" } }
        },
      ],
      tooltipFormatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
        if (seriesIndex === 0) return `${val.toFixed(2)} lbg/jam`;
        if (seriesIndex === 1) return `${val.toFixed(2)} mtr/jam`;
        return `${val.toFixed(4)} ltr/mtr`;
      },
      dataLabelFormatter: (val: number, opts: any) => {
        const si = opts.seriesIndex;
        if (si === 0) return (val as number).toFixed(1);
        if (si === 1) return (val as number).toFixed(1);
        return (val as number).toFixed(3);
      },
      dataLabelColors: ["#fd9141", "#34D399", "#FACC15"],
    },
    fuel: {
      title: "Fuel Consumption",
      stats: [
        { label: "Total Fuel (Ltr)", value: dailyData.summary.totalFuel, dec: 2, data: dailyData.fuel },
      ],
      mainData: dailyData.fuel,
      mainDec: 2,
      mainLabel: "Fuel/Hari",
      mainColor: "text-orange-500 dark:text-orange-400",
      series: [{ name: "Fuel (Ltr)", data: dailyData.fuel }],
      colors: ["#F97316"],
      yaxis: [{
        seriesName: "Fuel (Ltr)", min: 0, tickAmount: 5,
        labels: { style: { colors: "#F97316", fontSize: "11px" }, formatter: (v: number) => v.toFixed(0) },
        title: { text: "Liter", style: { color: "#F97316" } }
      }],
      tooltipFormatter: (val: number) => `${val.toFixed(2)} ltr`,
      dataLabelFormatter: (val: number) => (val as number).toFixed(0),
      dataLabelColors: ["#F97316"],
    },
  }), [dailyData]);

  const cfg = tabConfig[tab];
  const mainPct = pctChange(cfg.mainData);
  const isPositive = Number(mainPct) >= 0;

  const tooManyPoints = dailyData.days.length > 15;

  const options: ApexOptions = {
    chart: {
      type: "line", fontFamily: "Outfit, sans-serif",
      toolbar: { show: false }, background: "transparent",
      animations: { enabled: true, speed: 600 }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        if (tooManyPoints && opts.dataPointIndex % 2 !== 0) return "";
        return cfg.dataLabelFormatter(val, opts);
      },
      style: {
        fontSize: "10px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: "700",
        colors: cfg.dataLabelColors,
      },
      background: {
        enabled: true,
        foreColor: isDark ? "#111827" : "#ffffff",
        padding: 3,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        opacity: 0.85,
        dropShadow: { enabled: false },
      },
      offsetY: -8,
    },
    stroke: { curve: "smooth", width: [2.5, 2.5, 2.5] },
    colors: cfg.colors,
    markers: { size: 4, hover: { size: 6 } },
    xaxis: {
      categories: dailyData.days,
      labels: { style: { colors: textColor, fontSize: "11px" }, rotate: 0 },
      axisBorder: { show: false }, axisTicks: { show: false },
      title: { text: "Hari", style: { color: textColor, fontSize: "11px" } }
    },
    yaxis: cfg.yaxis as ApexOptions["yaxis"],
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { top: 20, right: 10 } },
    legend: {
      show: true, position: "top", horizontalAlign: "right",
      labels: { colors: textColor }, markers: { size: 6 }
    },
    tooltip: {
      theme: isDark ? "dark" : "light", shared: true, intersect: false,
      y: { formatter: cfg.tooltipFormatter }
    },
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
          {loadingData ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : (
            cfg.stats.map((s) => {
              const p = pctChange(s.data), pos = Number(p) >= 0;
              return (
                <div key={s.label} className="flex flex-col">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-800 dark:text-white">
                      {s.data.length > 0 ? s.value.toFixed(s.dec) : "—"}
                    </span>
                    {s.data.length > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        pos
                          ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"
                      }`}>
                        {pos ? "+" : ""}{p}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TAB ROW */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {/* Baris 1: Unit selector */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1">
          <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Unit:</span>
          {loadingUnits ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : (
            <SingleSelect options={units} value={selectedUnit} onChange={setSelectedUnit} />
          )}
        </div>
        {/* Baris 2: Tab buttons rata kiri */}
        <div className="flex px-2">
          {(["productivity", "fuel"] as Tab[]).map((t) => {
            const active = tab === t;
            const icon = t === "productivity"
              ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                </svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z"/>
                  <path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1c.564 0 1.034.11 1.402.328.37.22.64.546.79.97.295.836.205 1.987.2 3.182v.006l-.002 2.29a.5.5 0 0 1-.498.5H15v4.5a1.5 1.5 0 0 1-3 0V12a2 2 0 0 1-2-2V2zm9 0a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13h8zm-4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
                </svg>;
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold underline-offset-4 transition-all ${
                  active
                    ? "underline decoration-2 decoration-[#fd9141] text-[#fd9141]"
                    : "no-underline text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}>
                {icon}{t === "productivity" ? "Productivity" : "Fuel"}
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER — tampilkan plan */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800">
        {loadingData ? (
          <p className="text-4xl font-bold text-gray-300">Loading...</p>
        ) : (
          <>
            <p className={`text-8xl tracking-tighter leading-none font-bold ${cfg.mainColor}`}>
              {dailyData.plan > 0 ? dailyData.plan : "—"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Plan · {selectedUnit} · {selectedMonth} 2026
              </span>
              {cfg.mainData.length > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isPositive
                    ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"
                }`}>
                  {isPositive ? "+" : ""}{mainPct}%
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* BODY */}
      <div className="p-4 md:p-6">
        {loadingData ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="text-gray-400 text-sm">Loading chart...</span>
          </div>
        ) : dailyData.days.length === 0 ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="text-gray-400 text-sm">Tidak ada data untuk periode ini</span>
          </div>
        ) : (
          // @ts-ignore
          <Chart options={options} series={cfg.series} type="line" height={300} />
        )}

        {/* Month picker */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {months.map((m) => (
                <button key={m} onClick={() => setSelectedMonth(m)}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedMonth === m
                      ? "bg-[#fd9141] text-white"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}>
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