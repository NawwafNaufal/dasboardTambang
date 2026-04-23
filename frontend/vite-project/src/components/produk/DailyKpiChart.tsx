import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router";
import * as ApexChartsLib from "apexcharts";

const BASE_URL = "https://moa2.site/api/api";

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
const months: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const KPI_OPTIONS = [
  { label: "PA", color: "#fd9141" },
  { label: "MA", color: "#FACC15" },
  { label: "UA", color: "#4ADE80" },
  { label: "EU", color: "#F87171" },
];

function UnitSelect({ value, onChange, units }: {
  value: string;
  onChange: (v: string) => void;
  units: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = units.filter((u) => u.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        <span>{value || "Pilih Unit"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#9ca3af" viewBox="0 0 16 16"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "#fff", borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid #f3f4f6", zIndex: 999,
          width: "160px", overflow: "hidden",
        }}>
          <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid #f3f4f6", position: "relative" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#9ca3af" viewBox="0 0 16 16"
              style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-40%)" }}>
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari unit..."
              style={{
                width: "100%", padding: "5px 8px 5px 26px",
                borderRadius: "8px", border: "1.5px solid #e5e7eb",
                fontSize: "12px", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ maxHeight: "220px", overflowY: "auto", padding: "6px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "12px", fontSize: "12px", color: "#9ca3af" }}>
                Tidak ditemukan
              </div>
            ) : filtered.map((u) => {
              const isActive = u === value;
              return (
                <div
                  key={u}
                  onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "7px 10px", borderRadius: "8px", cursor: "pointer",
                    fontSize: "13px", fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#111827" : "#374151",
                    background: isActive ? "#f3f4f6" : "transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span>{u}</span>
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#111827" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ChartData {
  PA: number[];
  MA: number[];
  UA: number[];
  EU: number[];
  days: string[];
  summary: { avgPA: number; avgMA: number; avgUA: number; avgEU: number };
}

const EMPTY_CHART: ChartData = {
  PA: [], MA: [], UA: [], EU: [], days: [],
  summary: { avgPA: 0, avgMA: 0, avgUA: 0, avgEU: 0 },
};

export default function DailyKpiChart({ selectedPT }: { selectedPT: string }) {
  const { currentUnitActivity } = useOutletContext<{ currentUnitActivity: string }>();

  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const [selectedMonth, setSelectedMonth] = useState<Month>(months[new Date().getMonth()]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState<string[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [chartData, setChartData] = useState<ChartData>(EMPTY_CHART);
  const [loadingChart, setLoadingChart] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<"PA" | "MA" | "UA" | "EU">("PA");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
    const fetchChart = async () => {
      try {
        setLoadingChart(true);
        const res = await fetch(
          `${BASE_URL}/daily-availability?site=${encodeURIComponent(selectedPT)}&activity=${encodeURIComponent(currentUnitActivity)}&year=2026&month=${monthIdx}&unit=${encodeURIComponent(selectedUnit)}`
        );
        const result = await res.json();
        if (result.success && result.data.daily.length > 0) {
          const raw = result.data.daily;
          setChartData({
            PA: raw.map((d: any) => d.pa ?? 0),
            MA: raw.map((d: any) => d.ma ?? 0),
            UA: raw.map((d: any) => d.ua ?? 0),
            EU: raw.map((d: any) => d.eu ?? 0),
            days: raw.map((d: any) => `${d.day}`),
            summary: result.data.summary,
          });
        } else {
          setChartData(EMPTY_CHART);
        }
      } catch {
        setChartData(EMPTY_CHART);
      } finally {
        setLoadingChart(false);
      }
    };
    fetchChart();
  }, [selectedPT, currentUnitActivity, selectedUnit, selectedMonth]);

  useEffect(() => {
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "margin-left" || e.propertyName === "width") {
        setTimeout(() => {
          (ApexChartsLib as any).exec("kpi-single", "updateOptions", {}, false, false);
        }, 100);
      }
    };
    document.addEventListener("transitionend", onTransitionEnd);
    return () => document.removeEventListener("transitionend", onTransitionEnd);
  }, []);

  const activeKpi = KPI_OPTIONS.find((k) => k.label === selectedKpi)!;
  const data = (chartData[selectedKpi] ?? []).map((v) => v ?? 0);

  const avgMap = {
    PA: chartData.summary.avgPA,
    MA: chartData.summary.avgMA,
    UA: chartData.summary.avgUA,
    EU: chartData.summary.avgEU,
  };
  const avg = avgMap[selectedKpi];

  const textColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#2e2e33" : "#E5E7EB";

  const options: ApexOptions = useMemo(() => ({
    chart: {
      id: "kpi-single",
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: true, type: "x", autoScaleYaxis: false },
      animations: { enabled: true, dynamicAnimation: { enabled: true, speed: 350 } },
      events: {
        zoomed: (_ctx: any, { xaxis }: { xaxis: { min: number; max: number } }) => {
          setIsZoomed((xaxis.max - xaxis.min) < 25);
        },
        beforeResetZoom: () => { setIsZoomed(false); return undefined; },
      },
    },
    colors: [activeKpi.color],
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] },
    },
    markers: {
      size: 4,
      colors: [activeKpi.color],
      strokeColors: isDark ? "#1c1c1f" : "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: {
      enabled: isZoomed,
      background: {
        enabled: true, foreColor: activeKpi.color,
        borderRadius: 4, padding: 4, opacity: 0.9, borderWidth: 0,
      },
      style: { fontSize: "10px", fontWeight: 600, colors: ["#ffffff"] },
      offsetY: -18,
      formatter: (value: number) => `${value ?? 0}%`,
    },
    xaxis: {
      categories: chartData.days.length > 0
        ? chartData.days
        : Array.from({ length: 31 }, (_, i) => `${i + 1}`),
      labels: {
        style: { colors: textColor, fontSize: "10px" },
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: { colors: textColor, fontSize: "10px" },
        formatter: (v) => `${v}%`,
        offsetX: -8,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      padding: { left: 40, right: 10, top: 30, bottom: 0 },
    },
    legend: { show: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true, intersect: false,
      y: { formatter: (v) => `${v ?? 0}%` },
    },
  }), [isZoomed, isDark, activeKpi.color, textColor, gridColor, chartData.days]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">

      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trend Harian — {selectedMonth} 2026
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            <span style={{ color: activeKpi.color }}>{selectedKpi}</span>
            {selectedUnit && (
              <span className="text-gray-400 font-normal text-base"> · {selectedUnit}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">

          <div className="hidden md:flex items-center" style={{ gap: 2 }}>
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  background: selectedMonth === m ? "#fd9141" : "transparent",
                  color: selectedMonth === m ? "#fff" : "#9ca3af",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex md:hidden items-center gap-1.5">
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value as Month)}
              style={{
                padding: "5px 10px",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                background: "#fff",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Unit:</span>
            {loadingUnits ? (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Loading...</span>
            ) : (
              <UnitSelect value={selectedUnit} onChange={setSelectedUnit} units={units} />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {KPI_OPTIONS.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => setSelectedKpi(kpi.label as any)}
            style={{
              backgroundColor: kpi.color,
              color: "#fff",
              opacity: selectedKpi === kpi.label ? 1 : 0.35,
              border: "none",
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transform: selectedKpi === kpi.label ? "scale(1)" : "scale(0.95)",
              transition: "all 0.15s",
            }}
          >
            {kpi.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          avg{" "}
          <span style={{ color: activeKpi.color, fontWeight: 600 }}>
            {loadingChart ? "..." : `${avg.toFixed(1)}%`}
          </span>
        </span>
      </div>

      <div className="border border-gray-100 dark:border-gray-800 rounded-xl px-3 pt-2 pb-0">
        <div className="w-full max-w-full overflow-hidden">
          {loadingChart ? (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="text-gray-400 text-sm">Loading...</span>
            </div>
          ) : chartData.days.length === 0 ? (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="text-gray-400 text-sm">Tidak ada data untuk periode ini</span>
            </div>
          ) : (
            <Chart
              options={options}
              series={[{
                name: selectedKpi,
                data: data,
                color: activeKpi.color,
              }]}
              type="area"
              height={300}
              width="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
}