import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo, useState, useRef, useEffect } from "react";

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


const generateMonthlyMetrics = (month: Month) => {
  const seed = months.indexOf(month) + 1;
  return [
    { label: "Lbg/Jam", value: parseFloat((6 + seed * 0.3).toFixed(2)),       max: 15,  min: parseFloat((4 + seed * 0.1).toFixed(2)),    avg: parseFloat((5 + seed * 0.2).toFixed(2))   },
    { label: "Mtr/Jam", value: parseFloat((38 + seed * 0.8).toFixed(2)),      max: 60,  min: parseFloat((30 + seed * 0.5).toFixed(2)),   avg: parseFloat((35 + seed * 0.6).toFixed(2))  },
    { label: "Ltr/Mtr", value: parseFloat((0.75 + seed * 0.006).toFixed(3)),  max: 1.5, min: parseFloat((0.6 + seed * 0.004).toFixed(3)), avg: parseFloat((0.68 + seed * 0.005).toFixed(3)) },
  ];
};

export default function ProductivityIndexChart() {
  const [selectedMonth, setSelectedMonth] = useState<Month>("Jan");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(ALL_UNITS[0]);

  const metrics = useMemo(() => generateMonthlyMetrics(selectedMonth), [selectedMonth]);
  const series = metrics.map((m) => parseFloat(((m.value / m.max) * 100).toFixed(1)));

  const options: ApexOptions = useMemo(() => ({
    series,
    chart: {
      height: 320,
      type: "radialBar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: { margin: 5, size: "30%", background: "transparent" },
        dataLabels: {
          name: { show: false },
          value: { show: false },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "14px",
          formatter: (seriesName: string, opts: any) => {
            const idx = opts.seriesIndex;
            return `${seriesName}:  ${metrics[idx].value}`;
          },
        } as any,
      },
    },
    colors: ["#27B5F5", "#1DA1F2", "#0E8AD9"],
    labels: metrics.map((m) => m.label),
    responsive: [{ breakpoint: 480, options: { legend: { show: false } } }],
  }), [selectedMonth]);

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 dark:bg-gray-900 dark:border-gray-800 flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
            Produktivity Index
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white mt-0.5">
            Total Bulanan
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Month Picker */}
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedMonth}
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMonthPicker && (
              <div className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 grid grid-cols-3 gap-1 w-44">
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMonth(m); setShowMonthPicker(false); }}
                    className={`text-xs px-2 py-1.5 rounded-lg font-medium transition-all ${
                      selectedMonth === m
                        ? "bg-brand-500 text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unit Select */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}></span>
            <UnitSelect value={selectedUnit} onChange={setSelectedUnit} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center">
        <Chart options={options} series={series} type="radialBar" height={320} width="100%" />
      </div>

      {/* Min / Avg / Max */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{m.label}</p>
              <p className="text-[10px] text-gray-400">Average</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{m.avg}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}