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

const MACHINES = ["M-01", "M-02", "M-03", "M-04", "M-05", "M-06"];

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTH_NAMES_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function makeSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function getDailyData(date: string): DataRecord[] {
  return MACHINES.map((machine) => {
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
  return MACHINES.map((machine) => {
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
        <span style={{ fontSize: "16px" }}>📅</span>
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
        <span style={{ fontSize: "16px" }}>📅</span>
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

  const chartData: DataRecord[] = useMemo(() => {
    return period === "harian"
      ? getDailyData(selectedDate)
      : getMonthlyData(selectedYear, selectedMonth);
  }, [period, selectedDate, selectedYear, selectedMonth]);

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
    <div style={{ padding: "24px", fontFamily: "sans-serif", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", background: "#fff" }}>

      {/* Period Toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
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

      {/* Picker */}
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
      <ReactApexChart options={options} series={series} type="bar" height={420} />

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {[
          { label: "Total Produksi",  value: `${totalProd}h`, color: "#008FFB" },
          { label: "Total Standby",   value: `${totalStb}h`,  color: "#00E396" },
          { label: "Total Breakdown", value: `${totalBD}h`,   color: "#FEB019" },
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

    </div>
  );
};

export default ProductionStackedBar;