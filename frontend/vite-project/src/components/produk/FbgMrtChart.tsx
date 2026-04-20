import React, { useState, useMemo, useRef, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Period  = "harian" | "bulanan";
type Divisi  = "produksi" | "hauling";

interface DataRecord {
  machine: string;
  col1: number; 
  col2: number; 
}

const ALL_MACHINES = [
  "M-01","M-02","M-03","M-04","M-05","M-06","M-07","M-08","M-09","M-10",
  "M-11","M-12","M-13","M-14","M-15","M-16","M-17","M-18","M-19","M-20",
  "M-21","M-22","M-23","M-24","M-25","M-26","M-27","M-28","M-29","M-30",
  "M-31","M-32","M-33",
];
const PAGE_SIZE = 6;

const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const MONTH_NAMES_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function makeSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Produksi: fbg & mtr
function getProduksiDaily(date: string): DataRecord[] {
  return ALL_MACHINES.map((machine) => {
    const s1 = makeSeed("fbg" + date + machine);
    const s2 = makeSeed("mtr" + date + machine);
    return { machine, col1: Math.max(50, 300 + (s1 % 500)), col2: Math.max(50, 300 + (s2 % 500)) };
  });
}
function getProduksiMonthly(year: number, month: number): DataRecord[] {
  const key = `${year}-${String(month).padStart(2, "0")}`;
  return ALL_MACHINES.map((machine) => {
    const s1 = makeSeed("fbg" + key + machine);
    const s2 = makeSeed("mtr" + key + machine);
    return { machine, col1: Math.max(1000, 7000 + (s1 % 12000)), col2: Math.max(1000, 7000 + (s2 % 12000)) };
  });
}

// Loading/Hauling: rit & ton
function getHaulingDaily(date: string): DataRecord[] {
  return ALL_MACHINES.map((machine) => {
    const s1 = makeSeed("rit" + date + machine);
    const s2 = makeSeed("ton" + date + machine);
    return { machine, col1: Math.max(0, 20 + (s1 % 60)), col2: Math.max(0, 150 + (s2 % 400)) };
  });
}
function getHaulingMonthly(year: number, month: number): DataRecord[] {
  const key = `${year}-${String(month).padStart(2, "0")}`;
  return ALL_MACHINES.map((machine) => {
    const s1 = makeSeed("rit" + key + machine);
    const s2 = makeSeed("ton" + key + machine);
    return { machine, col1: Math.max(0, 500 + (s1 % 1500)), col2: Math.max(0, 4000 + (s2 % 10000)) };
  });
}

// ── Month Picker ───────────────────────────────────────
const MonthPicker: React.FC<{ year: number; month: number; onChange: (y: number, m: number) => void }> = ({ year, month, onChange }) => {
  const [open, setOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", color: "#374151" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#9ca3af" viewBox="0 0 16 16" style={{flexShrink:0}}>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
        </svg>{MONTH_NAMES_SHORT[month - 1]} {year}<span style={{ fontSize: "12px", color: "#9ca3af" }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "16px", zIndex: 999, minWidth: "220px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <button onClick={() => setDisplayYear(y => y - 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 6px" }}>‹</button>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>{displayYear}</span>
            <button onClick={() => setDisplayYear(y => y + 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 6px" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {MONTH_NAMES_SHORT.map((name, idx) => {
              const isActive = displayYear === year && idx + 1 === month;
              return (
                <button key={name} onClick={() => { onChange(displayYear, idx + 1); setOpen(false); }}
                  style={{ padding: "8px 4px", borderRadius: "10px", border: "none", background: isActive ? "#3b82f6" : "transparent", color: isActive ? "#fff" : "#374151", fontWeight: isActive ? 700 : 500, cursor: "pointer", fontSize: "13px" }}
                  onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.background = "#eff6ff"; }}
                  onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.background = "transparent"; }}>
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Date Picker ────────────────────────────────────────
const DatePicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [vYear, vMonth, vDay] = value.split("-").map(Number);
  const [navYear, setNavYear]   = useState(vYear);
  const [navMonth, setNavMonth] = useState(vMonth);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const firstDay    = new Date(navYear, navMonth - 1, 1).getDay();
  const daysInMonth = new Date(navYear, navMonth, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const prevMonth = () => { if (navMonth === 1) { setNavYear(y => y-1); setNavMonth(12); } else setNavMonth(m => m-1); };
  const nextMonth = () => { if (navMonth === 12) { setNavYear(y => y+1); setNavMonth(1); } else setNavMonth(m => m+1); };
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", color: "#374151" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#9ca3af" viewBox="0 0 16 16" style={{flexShrink:0}}>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
        </svg>{String(vDay).padStart(2,"0")} {MONTH_NAMES_SHORT[vMonth-1]} {vYear}<span style={{ fontSize: "12px", color: "#9ca3af" }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "16px", zIndex: 999, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 8px" }}>‹</button>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>{MONTH_NAMES_FULL[navMonth-1]} {navYear}</span>
            <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 8px" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "4px" }}>
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => <div key={d} style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />;
              const isSelected = day === vDay && navMonth === vMonth && navYear === vYear;
              const isToday = day === new Date().getDate() && navMonth === new Date().getMonth()+1 && navYear === new Date().getFullYear();
              return (
                <button key={day} onClick={() => { onChange(`${navYear}-${String(navMonth).padStart(2,"0")}-${String(day).padStart(2,"0")}`); setOpen(false); }}
                  style={{ padding: "6px 2px", borderRadius: "8px", border: "none", background: isSelected ? "#3b82f6" : isToday ? "#eff6ff" : "transparent", color: isSelected ? "#fff" : isToday ? "#3b82f6" : "#374151", fontWeight: isSelected || isToday ? 700 : 400, cursor: "pointer", fontSize: "12px", textAlign: "center" }}
                  onMouseEnter={e => { if (!isSelected) (e.target as HTMLElement).style.background = "#f3f4f6"; }}
                  onMouseLeave={e => { if (!isSelected) (e.target as HTMLElement).style.background = isToday ? "#eff6ff" : "transparent"; }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────
const OutputChart: React.FC = () => {
  const [period,       setPeriod]       = useState<Period>("harian");
  const [divisi,       setDivisi]       = useState<Divisi>("produksi");
  const [selectedDate, setSelectedDate] = useState("2026-02-27");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(ALL_MACHINES.length / PAGE_SIZE);
  const MACHINES = ALL_MACHINES.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Labels fixed to produksi
  const label1 = "LBG";
  const label2 = "MTR";
  const unit1  = "";
  const unit2  = "";

  const chartData: DataRecord[] = useMemo(() => {
    const all = period === "harian" ? getProduksiDaily(selectedDate) : getProduksiMonthly(selectedYear, selectedMonth);
    return all.filter((d) => MACHINES.includes(d.machine));
  }, [period, selectedDate, selectedYear, selectedMonth, MACHINES]);

  const titleText = useMemo(() => {
    if (period === "harian") {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return `Output Produksi (LBG & MTR) — ${String(d).padStart(2,"0")} ${MONTH_NAMES_FULL[m-1]} ${y}`;
    }
    return `Output Produksi (FBG & MTR) — ${MONTH_NAMES_FULL[selectedMonth-1]} ${selectedYear}`;
  }, [period, selectedDate, selectedYear, selectedMonth]);

  const series = [
    { name: label1, type: "column" as const, data: chartData.map((d) => d.col1) },
    { name: label2, type: "line"   as const, data: chartData.map((d) => d.col2) },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { width: [0, 4] },
    title: {
      text: titleText,
      align: "left",
      style: { fontSize: "14px", fontWeight: "600" },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    plotOptions: {
      bar: { columnWidth: "50%" },
    },
    xaxis: {
      categories: MACHINES,
      title: { text: "Mesin" },
    },
    yaxis: [
      { title: { text: label1 } },
      { opposite: true, title: { text: label2 } },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: (val: number) => `${val} ${unit1}` },
        { formatter: (val: number) => `${val} ${unit2}` },
      ],
    },
  };

  const total1 = chartData.reduce((s, d) => s + d.col1, 0);
  const total2 = chartData.reduce((s, d) => s + d.col2, 0);
  const top1   = [...chartData].sort((a, b) => b.col1 - a.col1)[0];
  const top2   = [...chartData].sort((a, b) => b.col2 - a.col2)[0];

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 20px", borderRadius: "4px", border: "1px solid #ccc",
    background: active ? "#008FFB" : "#fff",
    color: active ? "#fff" : "#333",
    cursor: "pointer", fontWeight: active ? 600 : 400,
    fontSize: "14px",
  });

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", background: "#fff", height: "100%" }}>

      {/* Row 1: Period kiri + Picker kanan */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["harian", "bulanan"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={btnStyle(period === p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        {period === "harian"
          ? <DatePicker value={selectedDate} onChange={setSelectedDate} />
          : <MonthPicker year={selectedYear} month={selectedMonth} onChange={(y, m) => { setSelectedYear(y); setSelectedMonth(m); }} />
        }
      </div>

      {/* Chart */}
      <ReactApexChart options={options} series={series} type="line" height={420} />

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {[
          { label: `Total ${label1.split(" ")[0]}`, value: `${total1.toLocaleString()} ${unit1}`, color: "#008FFB" },
          { label: `Total ${label2.split(" ")[0]}`, value: `${total2.toLocaleString()} ${unit2}`, color: "#00E396" },
          { label: `Top ${label1.split(" ")[0]}`,   value: `${top1.machine} (${top1.col1})`,       color: "#FEB019" },
          { label: `Top ${label2.split(" ")[0]}`,   value: `${top2.machine} (${top2.col2})`,       color: "#775DD0" },
        ].map((c) => (
          <div key={c.label} style={{ flex: 1, border: "1px solid #eee", borderRadius: "8px", padding: "12px", textAlign: "center", minHeight: "72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px", whiteSpace: "nowrap" }}>{c.label}</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: c.color, whiteSpace: "nowrap" }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          Mesin {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, ALL_MACHINES.length)} dari {ALL_MACHINES.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb", background: page === 0 ? "#f9fafb" : "#fff", color: page === 0 ? "#d1d5db" : "#374151", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600 }}
          >‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{ padding: "4px 9px", borderRadius: "6px", border: "1px solid #e5e7eb", background: page === i ? "#008FFB" : "#fff", color: page === i ? "#fff" : "#374151", cursor: "pointer", fontSize: "12px", fontWeight: page === i ? 700 : 400 }}
            >{i + 1}</button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb", background: page === totalPages - 1 ? "#f9fafb" : "#fff", color: page === totalPages - 1 ? "#d1d5db" : "#374151", cursor: page === totalPages - 1 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600 }}
          >›</button>
        </div>
      </div>

    </div>
  );
};

export default OutputChart;