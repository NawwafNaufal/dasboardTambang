import React, { useState, useMemo, useRef, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Period = "harian" | "bulanan";

interface DataRecord {
  machine: string;
  produksi: number;
  standby: number;
  breakdown: number;
}

const ALL_MACHINES = [
  "M-01","M-02","M-03","M-04","M-05","M-06","M-07","M-08","M-09","M-10",
  "M-11","M-12","M-13","M-14","M-15","M-16","M-17","M-18","M-19","M-20",
  "M-21","M-22","M-23","M-24","M-25","M-26","M-27","M-28","M-29","M-30",
  "M-31","M-32","M-33",
];
const PAGE_SIZE = 6;

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTH_NAMES_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function makeSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function getDailyData(date: string): DataRecord[] {
  return ALL_MACHINES.map((machine) => {
    const seed = makeSeed(date + machine);
    return {
      machine,
      produksi:  200 + (seed % 400),
      standby:   40  + ((seed >> 3) % 120),
      breakdown: (seed % 10) > 6 ? (seed % 30) : 0,
    };
  });
}
function getMonthlyData(year: number, month: number): DataRecord[] {
  const key = `${year}-${String(month).padStart(2,"0")}`;
  return ALL_MACHINES.map((machine) => {
    const seed = makeSeed(key + machine);
    return {
      machine,
      produksi:  5000 + (seed % 8000),
      standby:   1000 + ((seed >> 3) % 3000),
      breakdown: seed % 500,
    };
  });
}

// ── Custom Month Picker ────────────────────────────────
interface MonthPickerProps {
  year: number;
  month: number; // 1-12
  onChange: (year: number, month: number) => void;
}
const MonthPicker: React.FC<MonthPickerProps> = ({ year, month, onChange }) => {
  const [open, setOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "7px 14px", borderRadius: "8px",
          border: "1px solid #d1d5db", background: "#fff",
          fontSize: "14px", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          color: "#374151",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#9ca3af" viewBox="0 0 16 16" style={{flexShrink:0}}>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
        </svg>
        {MONTH_NAMES_SHORT[month - 1]} {year}
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          background: "#fff", borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          padding: "16px", zIndex: 999, minWidth: "220px",
        }}>
          {/* Year nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <button onClick={() => setDisplayYear(y => y - 1)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 6px" }}>‹</button>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>{displayYear}</span>
            <button onClick={() => setDisplayYear(y => y + 1)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 6px" }}>›</button>
          </div>

          {/* Month grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {MONTH_NAMES_SHORT.map((name, idx) => {
              const isActive = displayYear === year && idx + 1 === month;
              return (
                <button
                  key={name}
                  onClick={() => { onChange(displayYear, idx + 1); setOpen(false); }}
                  style={{
                    padding: "8px 4px", borderRadius: "10px", border: "none",
                    background: isActive ? "#3b82f6" : "transparent",
                    color: isActive ? "#fff" : "#374151",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer", fontSize: "13px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.background = "#eff6ff"; }}
                  onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.background = "transparent"; }}
                >
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

// ── Custom Date Picker ─────────────────────────────────
interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (val: string) => void;
}
const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [vYear, vMonth, vDay] = value.split("-").map(Number);
  const [navYear,  setNavYear]  = useState(vYear);
  const [navMonth, setNavMonth] = useState(vMonth);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(navYear, navMonth - 1, 1).getDay();
  const daysInMonth = new Date(navYear, navMonth, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const prevMonth = () => {
    if (navMonth === 1) { setNavYear(y => y - 1); setNavMonth(12); }
    else setNavMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (navMonth === 12) { setNavYear(y => y + 1); setNavMonth(1); }
    else setNavMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const val = `${navYear}-${String(navMonth).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(val);
    setOpen(false);
  };

  const displayLabel = `${String(vDay).padStart(2,"0")} ${MONTH_NAMES_SHORT[vMonth-1]} ${vYear}`;

  const DAYS_LABEL = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "7px 14px", borderRadius: "8px",
          border: "1px solid #d1d5db", background: "#fff",
          fontSize: "14px", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)", color: "#374151",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#9ca3af" viewBox="0 0 16 16" style={{flexShrink:0}}>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
        </svg>
        {displayLabel}
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          background: "#fff", borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          padding: "16px", zIndex: 999, minWidth: "260px",
        }}>
          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <button onClick={prevMonth}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 8px" }}>‹</button>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>
              {MONTH_NAMES_FULL[navMonth - 1]} {navYear}
            </span>
            <button onClick={nextMonth}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#6b7280", padding: "2px 8px" }}>›</button>
          </div>

          {/* Day labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "4px" }}>
            {DAYS_LABEL.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", fontWeight: 600, padding: "2px 0" }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const isSelected = day === vDay && navMonth === vMonth && navYear === vYear;
              const isToday = day === new Date().getDate() && navMonth === new Date().getMonth()+1 && navYear === new Date().getFullYear();
              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  style={{
                    padding: "6px 2px", borderRadius: "8px", border: "none",
                    background: isSelected ? "#3b82f6" : isToday ? "#eff6ff" : "transparent",
                    color: isSelected ? "#fff" : isToday ? "#3b82f6" : "#374151",
                    fontWeight: isSelected || isToday ? 700 : 400,
                    cursor: "pointer", fontSize: "12px", textAlign: "center",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.target as HTMLElement).style.background = "#f3f4f6"; }}
                  onMouseLeave={e => { if (!isSelected) (e.target as HTMLElement).style.background = isToday ? "#eff6ff" : "transparent"; }}
                >
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
const ProductionStackedBar: React.FC = () => {
  const [period, setPeriod] = useState<Period>("harian");
  const [selectedDate,  setSelectedDate]  = useState("2026-02-27");
  const [selectedYear,  setSelectedYear]  = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(ALL_MACHINES.length / PAGE_SIZE);
  const MACHINES = ALL_MACHINES.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const chartData: DataRecord[] = useMemo(() => {
    const all = period === "harian"
      ? getDailyData(selectedDate)
      : getMonthlyData(selectedYear, selectedMonth);
    // Filter hanya mesin yang ada di halaman aktif
    return all.filter((d) => MACHINES.includes(d.machine));
  }, [period, selectedDate, selectedYear, selectedMonth, MACHINES]);

  const series = [
    { name: "Produksi",  data: chartData.map((d) => d.produksi)  },
    { name: "Standby",   data: chartData.map((d) => d.standby)   },
    { name: "Breakdown", data: chartData.map((d) => d.breakdown) },
  ];

  const titleText = useMemo(() => {
    if (period === "harian") {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return `Distribusi Waktu Mesin — ${String(d).padStart(2,"0")} ${MONTH_NAMES_FULL[m-1]} ${y}`;
    }
    return `Distribusi Waktu Mesin — ${MONTH_NAMES_FULL[selectedMonth-1]} ${selectedYear}`;
  }, [period, selectedDate, selectedYear, selectedMonth]);

  const options: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false }, animations: { enabled: true, speed: 400 } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%", dataLabels: { position: "center" } } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? `${val}h` : ""),
      style: { fontSize: "11px", fontWeight: "600" },
    },
    xaxis: { categories: MACHINES, title: { text: "Mesin" } },
    yaxis: { title: { text: "Jam" }, labels: { formatter: (val: number) => `${val}h` } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { shared: true, intersect: false, y: { formatter: (val: number) => `${val} jam` } },
    title: { text: titleText, align: "left", style: { fontSize: "14px", fontWeight: "600" } },
  };

  const totalProd = chartData.reduce((s, d) => s + d.produksi,  0);
  const totalStb  = chartData.reduce((s, d) => s + d.standby,   0);
  const totalBD   = chartData.reduce((s, d) => s + d.breakdown,  0);
  const totalAll  = totalProd + totalStb + totalBD;
  const avail     = totalAll > 0 ? ((totalProd / totalAll) * 100).toFixed(1) + "%" : "0%";

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", background: "#fff", height: "100%" }}>

      {/* Row 1: Period Toggle kiri + Picker kanan */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "8px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["harian", "bulanan"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "6px 20px", borderRadius: "4px",
              border: "1px solid #ccc",
              background: period === p ? "#008FFB" : "#fff",
              color: period === p ? "#fff" : "#333",
              cursor: "pointer", fontWeight: period === p ? 600 : 400,
              textTransform: "capitalize", fontSize: "14px",
            }}>
              {p}
            </button>
          ))}
        </div>
        {period === "harian"
          ? <DatePicker value={selectedDate} onChange={setSelectedDate} />
          : <MonthPicker year={selectedYear} month={selectedMonth} onChange={(y, m) => { setSelectedYear(y); setSelectedMonth(m); }} />
        }
      </div>

      {/* Chart */}
      <ReactApexChart options={options} series={series} type="bar" height={420} />

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {[
          { label: "Total Produksi",  value: `${totalProd}`, color: "#008FFB" },
          { label: "Total Standby",   value: `${totalStb}`,  color: "#00E396" },
          { label: "Total Breakdown", value: `${totalBD}`,   color: "#FEB019" },
          { label: "Availability",    value: avail,            color: "#775DD0" },
        ].map((c) => (
          <div key={c.label} style={{
            flex: 1, border: "1px solid #eee", borderRadius: "8px",
            padding: "12px", textAlign: "center",
          }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>{c.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: c.color }}>{c.value}</div>
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

export default ProductionStackedBar;