import React, { useState, useMemo, useRef, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Period  = "harian" | "bulanan";
type Divisi  = "produksi" | "hauling";

interface DataRecord {
  machine: string;
  col1: number; // fbg or rit
  col2: number; // mtr or ton
}

const MACHINES = ["M-01", "M-02", "M-03", "M-04", "M-05", "M-06"];
const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const MONTH_NAMES_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function makeSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Produksi: fbg & mtr
function getProduksiDaily(date: string): DataRecord[] {
  const bases = [304, 225, 239, 240, 604, 705];
  const mtrs  = [300, 304, 300, 240, 300, 705];
  return MACHINES.map((machine, i) => {
    const s1 = makeSeed("fbg" + date + machine);
    const s2 = makeSeed("mtr" + date + machine);
    return { machine, col1: Math.max(50, bases[i] + ((s1 % 11) - 5) * 20), col2: Math.max(50, mtrs[i] + ((s2 % 11) - 5) * 25) };
  });
}
function getProduksiMonthly(year: number, month: number): DataRecord[] {
  const key   = `${year}-${String(month).padStart(2, "0")}`;
  const bases = [7904, 5850, 6214, 6240, 15704, 18330];
  const mtrs  = [7800, 7904, 7800, 6240, 7800, 18330];
  return MACHINES.map((machine, i) => {
    const s1 = makeSeed("fbg" + key + machine);
    const s2 = makeSeed("mtr" + key + machine);
    return { machine, col1: Math.max(1000, bases[i] + ((s1 % 11) - 5) * 500), col2: Math.max(1000, mtrs[i] + ((s2 % 11) - 5) * 600) };
  });
}

// Loading/Hauling: rit & ton
function getHaulingDaily(date: string): DataRecord[] {
  const rits = [43, 0, 0, 0, 0, 0];
  const tons = [357, 0, 0, 0, 0, 0];
  return MACHINES.map((machine, i) => {
    const s1 = makeSeed("rit" + date + machine);
    const s2 = makeSeed("ton" + date + machine);
    return { machine, col1: Math.max(0, rits[i] + ((s1 % 9) - 4) * 3), col2: Math.max(0, tons[i] + ((s2 % 9) - 4) * 15) };
  });
}
function getHaulingMonthly(year: number, month: number): DataRecord[] {
  const key  = `${year}-${String(month).padStart(2, "0")}`;
  const rits = [1118, 0, 0, 0, 0, 0];
  const tons = [9282, 0, 0, 0, 0, 0];
  return MACHINES.map((machine, i) => {
    const s1 = makeSeed("rit" + key + machine);
    const s2 = makeSeed("ton" + key + machine);
    return { machine, col1: Math.max(0, rits[i] + ((s1 % 9) - 4) * 50), col2: Math.max(0, tons[i] + ((s2 % 9) - 4) * 200) };
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
        <span>📅</span>{MONTH_NAMES_SHORT[month - 1]} {year}<span style={{ fontSize: "12px", color: "#9ca3af" }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "16px", zIndex: 999, minWidth: "220px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
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
        <span>📅</span>{String(vDay).padStart(2,"0")} {MONTH_NAMES_SHORT[vMonth-1]} {vYear}<span style={{ fontSize: "12px", color: "#9ca3af" }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "16px", zIndex: 999, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
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

  // Labels based on divisi
  const label1 = divisi === "produksi" ? "FBG (karung)" : "RIT (trip)";
  const label2 = divisi === "produksi" ? "MTR (meter)"  : "TON (ton)";
  const unit1  = divisi === "produksi" ? "karung"       : "trip";
  const unit2  = divisi === "produksi" ? "meter"        : "ton";

  const chartData: DataRecord[] = useMemo(() => {
    if (divisi === "produksi") {
      return period === "harian" ? getProduksiDaily(selectedDate) : getProduksiMonthly(selectedYear, selectedMonth);
    } else {
      return period === "harian" ? getHaulingDaily(selectedDate) : getHaulingMonthly(selectedYear, selectedMonth);
    }
  }, [divisi, period, selectedDate, selectedYear, selectedMonth]);

  const titleText = useMemo(() => {
    const divisiLabel = divisi === "produksi" ? "FBG & MTR" : "RIT & TON";
    const divisiTitle = divisi === "produksi" ? "Produksi" : "Loading/Hauling";
    if (period === "harian") {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return `Output ${divisiTitle} (${divisiLabel}) — ${String(d).padStart(2,"0")} ${MONTH_NAMES_FULL[m-1]} ${y}`;
    }
    return `Output ${divisiTitle} (${divisiLabel}) — ${MONTH_NAMES_FULL[selectedMonth-1]} ${selectedYear}`;
  }, [divisi, period, selectedDate, selectedYear, selectedMonth]);

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

  const divisiStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 20px", borderRadius: "4px", border: "1px solid #ccc",
    background: active ? "#775DD0" : "#fff",
    color: active ? "#fff" : "#333",
    cursor: "pointer", fontWeight: active ? 600 : 400,
    fontSize: "14px",
  });

  return (
    <div style={{ padding: "24px", maxWidth: "860px", margin: "0 auto", fontFamily: "sans-serif" }}>

      {/* Row 1: Period + Divisi toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Period */}
        <div style={{ display: "flex", gap: "6px" }}>
          {(["harian", "bulanan"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={btnStyle(period === p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ width: "1px", height: "32px", background: "#e5e7eb", margin: "0 4px" }} />

        {/* Divisi */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => setDivisi("produksi")} style={divisiStyle(divisi === "produksi")}>Produksi</button>
          <button onClick={() => setDivisi("hauling")}  style={divisiStyle(divisi === "hauling")}>Loading/Hauling</button>
        </div>
      </div>

      {/* Row 2: Picker */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>
          {period === "harian" ? "Pilih Tanggal:" : "Pilih Bulan:"}
        </span>
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
          { label: `Total ${label1}`, value: `${total1.toLocaleString()} ${unit1}`, color: "#008FFB" },
          { label: `Total ${label2}`, value: `${total2.toLocaleString()} ${unit2}`, color: "#00E396" },
          { label: `Top ${label1}`,   value: `${top1.machine} (${top1.col1})`,       color: "#FEB019" },
          { label: `Top ${label2}`,   value: `${top2.machine} (${top2.col2})`,       color: "#775DD0" },
        ].map((c) => (
          <div key={c.label} style={{ flex: 1, border: "1px solid #eee", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>{c.label}</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OutputChart;