import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useMemo, useEffect, useRef } from "react";
import * as ApexChartsLib from "apexcharts";

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
const months: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ALL_UNITS = [
  "U.02","U.03","U.04","U.05","U.06","U.07","U.09","U.10","U.12","U.13",
  "U.16","U.17","U.19","U.20","U.23","U.39","U.40","U.41","U.50","U.51",
  "U.52","U.54","U.55","U.56","U.24","U.25","U.27","U.28","U.29","U.30",
  "U.31","U.32",
];

const seriesData = [
  { name: "PA", data: [7, 8, 15, 18, 12, 10, 14, 9, 11, 13, 16, 8], color: "#F87171" },
  { name: "MA", data: [6, 8, 10, 14, 9, 7, 12, 8, 10, 11, 13, 7],   color: "#FCD34D" },
  { name: "UA", data: [5, 4, 5, 8, 6, 5, 7, 6, 5, 7, 9, 5],         color: "#86EFAC" },
  { name: "EU", data: [4, 6, 8, 11, 7, 6, 9, 5, 7, 8, 10, 6],       color: "#FCA5A5" },
];

// ── Unit Dropdown ──────────────────────────────────────
function UnitSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = ALL_UNITS.filter((u) => u.toLowerCase().includes(search.toLowerCase()));

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
      {/* Trigger */}
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        <span>{value}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" width="10" height="10"
          fill="#9ca3af" viewBox="0 0 16 16"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
        >
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "#fff", borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid #f3f4f6",
          zIndex: 999, width: "140px",
          overflow: "hidden",
        }}>
          {/* Search */}
          <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid #f3f4f6", position: "relative" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg" width="13" height="13"
              fill="#9ca3af" viewBox="0 0 16 16"
              style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-40%)" }}
            >
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
                fontSize: "12px", outline: "none",
                boxSizing: "border-box",
                transition: "border 0.15s",
              }}
              onFocus={e => (e.target.style.borderColor = "#d1d5db")}
              onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: "200px", overflowY: "auto", padding: "6px" }}>
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


const gen = (base: number, variance: number) =>
  Array.from({ length: 31 }, () =>
    parseFloat((base + (Math.random() - 0.5) * variance).toFixed(1))
  );

const generateChartData = () => ({
  PA: gen(96, 6),
  MA: gen(95, 5),
  UA: gen(82, 10),
  EU: gen(79, 10),
});

const charts = [
  { id: "kpi-pa", label: "PA", color: "#60A5FA" },
  { id: "kpi-ma", label: "MA", color: "#FACC15" },
  { id: "kpi-ua", label: "UA", color: "#4ADE80" },
  { id: "kpi-eu", label: "EU", color: "#F87171" },
];

function SingleChart({
  id, label, data, color, isDark,
}: {
  id: string;
  label: string;
  data: number[];
  color: string;
  isDark: boolean;
}) {
  const avg = (arr: number[]) => {
    if (!arr || arr.length === 0) return "0.0";
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  };

  const [isZoomed, setIsZoomed] = useState(false);
  const isZoomedRef = useRef(false);
  const textColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#2e2e33" : "#E5E7EB";

  const options: ApexOptions = useMemo(() => ({
    chart: {
      id,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: true, type: "x", autoScaleYaxis: false },
      animations: { enabled: true, dynamicAnimation: { enabled: true, speed: 350 } },
      events: {
        zoomed: (_ctx: any, { xaxis }: { xaxis: { min: number; max: number } }) => {
          const zoomed = (xaxis.max - xaxis.min) < 25;
          isZoomedRef.current = zoomed;
          setIsZoomed(zoomed);
        },
        beforeResetZoom: () => {
          isZoomedRef.current = false;
          setIsZoomed(false);
          return undefined;
        },
      },
    },
    colors: [color],
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] },
    },
    markers: {
      size: 4,
      colors: [color],
      strokeColors: isDark ? "#1c1c1f" : "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: {
      enabled: isZoomed,
      background: {
        enabled: true,
        foreColor: color,
        borderRadius: 4,
        padding: 4,
        opacity: 0.9,
        borderWidth: 0,
      },
      style: { fontSize: "10px", fontWeight: 600, colors: ["#ffffff"] },
      offsetY: -18,
      offsetX: 0,
      formatter: (value: number) => (value ? `${value}%` : ""),
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
      labels: { style: { colors: textColor, fontSize: "10px" }, hideOverlappingLabels: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 50, max: 100, tickAmount: 5,
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
      y: { formatter: (v) => `${v}%` },
    },
  }), [isZoomed, isDark, color, id]);

  useEffect(() => {
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "margin-left" || e.propertyName === "width") {
        setTimeout(() => {
          (ApexChartsLib as any).exec(id, "updateOptions", {}, false, false);
        }, 100);
      }
    };
    document.addEventListener("transitionend", onTransitionEnd);
    return () => document.removeEventListener("transitionend", onTransitionEnd);
  }, [id]);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl px-3 pt-2 pb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        <span className="text-xs text-gray-400">avg {avg(data)}%</span>
      </div>
      <div className="w-full max-w-full overflow-hidden">
        <Chart
          options={options}
          series={[{ name: label, data: data ?? [], color }]}
          type="area"
          height={220}
          width="100%"
        />
      </div>
    </div>
  );
}

export default function DailyKpiChart() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const [selectedMonth, setSelectedMonth] = useState<Month>("Jan");
  const [selectedUnit, setSelectedUnit] = useState(ALL_UNITS[0]);
  const [chartData, setChartData] = useState(generateChartData);

  useEffect(() => {
    setChartData(generateChartData());
  }, [selectedMonth]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const dataMap: Record<string, number[]> = {
    "kpi-pa": chartData.PA,
    "kpi-ma": chartData.MA,
    "kpi-ua": chartData.UA,
    "kpi-eu": chartData.EU,
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Trend Harian — {selectedMonth} 2026</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">PA · MA · UA · EU</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month tabs */}
          <div className="flex gap-1 flex-nowrap overflow-x-auto">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`text-xs px-2 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedMonth === m
                    ? "bg-brand-500 text-white"
                    : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

          {/* Unit select */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Unit:</span>
            <UnitSelect value={selectedUnit} onChange={setSelectedUnit} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {charts.map((c) => (
          <SingleChart
            key={c.id}
            id={c.id}
            label={c.label}
            data={dataMap[c.id]}
            color={c.color}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}