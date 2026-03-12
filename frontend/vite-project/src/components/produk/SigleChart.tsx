import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";

const BASE_URL = "http://76.13.198.60:4000/api";
const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const KPI_SERIES = [
  { name: "PA", color: "#F87171", key: "pa" },
  { name: "MA", color: "#FCD34D", key: "ma" },
  { name: "UA", color: "#86EFAC", key: "ua" },
  { name: "EU", color: "#FCA5A5", key: "eu" },
];

function UnitSelect({ value, onChange, units }: {
  value: string;
  onChange: (u: string) => void;
  units: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filtered = units.filter(u => u.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: 999, border: "1.5px solid #e5e7eb",
        background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151",
        cursor: "pointer", fontFamily: "inherit"
      }}>
        {value || "Pilih Unit"}
        <svg width="10" height="10" fill="#9ca3af" viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          border: "1px solid #f3f4f6", zIndex: 999, width: 140, overflow: "hidden"
        }}>
          <div style={{ padding: "8px 10px 6px", borderBottom: "1px solid #f3f4f6" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari unit..."
              autoFocus style={{
                width: "100%", padding: "5px 8px", borderRadius: 8, border: "1.5px solid #e5e7eb",
                fontSize: 12, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit"
              }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", padding: 6 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "8px 10px", fontSize: 12, color: "#9ca3af" }}>Tidak ada unit</div>
            )}
            {filtered.map(u => (
              <div key={u} onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                style={{
                  padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, fontWeight: u === value ? 700 : 400,
                  color: u === value ? "#111827" : "#374151",
                  background: u === value ? "#f3f4f6" : "transparent"
                }}
                onMouseEnter={e => { if (u !== value) (e.currentTarget as HTMLDivElement).style.background = "#f9fafb"; }}
                onMouseLeave={e => { if (u !== value) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                {u}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Tooltip({ tooltip, data }: { tooltip: any; data: number[][] }) {
  if (!tooltip) return null;
  const { x, y, monthIdx } = tooltip;
  return (
    <div style={{
      position: "fixed", left: x + 16, top: y - 10,
      background: "#fff", borderRadius: 14,
      boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #f0f0f0",
      padding: "12px 16px", zIndex: 9999, minWidth: 180, pointerEvents: "none"
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 8 }}>
        {months[monthIdx]} 2026
      </div>
      {KPI_SERIES.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
            <span style={{ fontSize: 13, color: "#6b7280" }}>{s.name}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{data[i][monthIdx] ?? 0}%</span>
        </div>
      ))}
    </div>
  );
}

export default function SyncKpiChart() {
  const { selectedPT, currentUnitActivity } = useOutletContext<{
    selectedPT: string;
    currentUnitActivity: string;
  }>();

  const year = 2026;
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState<string[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [chartData, setChartData] = useState<number[][]>(KPI_SERIES.map(() => Array(12).fill(0)));
  const [loadingChart, setLoadingChart] = useState(false);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const fetchChart = async () => {
      try {
        setLoadingChart(true);
        const res = await fetch(
          `${BASE_URL}/availability-index?site=${encodeURIComponent(selectedPT)}&activity=${encodeURIComponent(currentUnitActivity)}&year=${year}&unit=${encodeURIComponent(selectedUnit)}`
        );
        const result = await res.json();
        if (result.success) {
          const built: number[][] = KPI_SERIES.map(() => Array(12).fill(0));
          for (const d of result.data) {
            const mi = d.month - 1;
            built[0][mi] = d.pa ?? 0;
            built[1][mi] = d.ma ?? 0;
            built[2][mi] = d.ua ?? 0;
            built[3][mi] = d.eu ?? 0;
          }
          setChartData(built);
        }
      } catch {
        setChartData(KPI_SERIES.map(() => Array(12).fill(0)));
      } finally {
        setLoadingChart(false);
      }
    };
    fetchChart();
  }, [selectedPT, currentUnitActivity, selectedUnit, year]);

  useEffect(() => {
    if (scrollRef.current) {
      const mi = new Date().getMonth();
      scrollRef.current.scrollLeft = Math.max(0, mi * 90 - 100);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent, mi: number) => {
    setActiveMonth(mi);
    setTooltip({ x: e.clientX, y: e.clientY, monthIdx: mi });
  };
  const handleMouseLeave = () => { setActiveMonth(null); setTooltip(null); };

  const colW = 90;
  const barW = 16;
  const barGap = 4;
  const chartH = 230;
  const labelH = 30; // ruang untuk label rotasi di atas bar
  const groupW = KPI_SERIES.length * (barW + barGap) - barGap;
  const TOP = labelH + 10; // beri ruang di atas untuk label

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", height: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .kpi-scroll { overflow-x: auto; overflow-y: hidden; max-width: 100%; }
        .kpi-scroll::-webkit-scrollbar { height: 4px; }
        .kpi-scroll::-webkit-scrollbar-track { background: #f9fafb; border-radius: 2px; }
        .kpi-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
        .bar-col:hover { background: rgba(0,0,0,0.025) !important; }
      `}</style>

      <div style={{
        background: "#fff", borderRadius: 24, border: "1px solid #f0f0f0",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: "20px 24px 16px",
        height: "100%", minHeight: 468,
        boxSizing: "border-box", display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, marginBottom: 2 }}>Bulanan — {year}</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>PA · MA · UA · EU</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Unit</span>
            {loadingUnits ? (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Loading...</span>
            ) : (
              <UnitSelect value={selectedUnit} onChange={setSelectedUnit} units={units} />
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
          {KPI_SERIES.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.name}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          ref={scrollRef}
          className="kpi-scroll"
          style={{ cursor: "grab", userSelect: "none", paddingBottom: 4, maxWidth: "100%", minHeight: chartH + TOP + 40 }}
          onMouseDown={e => {
            const el = scrollRef.current!;
            const startX = e.clientX + el.scrollLeft;
            const move = (ev: MouseEvent) => { el.scrollLeft = startX - ev.clientX; };
            const up = () => {
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
        >
          {loadingChart ? (
            <div style={{ height: chartH + TOP + 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>Loading...</span>
            </div>
          ) : (
            <svg width={months.length * colW} height={chartH + TOP + 40} style={{ display: "block" }}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(pct => {
                const y = TOP + chartH - (pct / 100) * chartH;
                return (
                  <line key={pct} x1={0} y1={y} x2={months.length * colW} y2={y}
                    stroke={pct === 100 ? "#e5e7eb" : "#f3f4f6"} strokeWidth={1} />
                );
              })}

              {months.map((m, mi) => {
                const cx = mi * colW + colW / 2;
                const isActive = activeMonth === mi;
                const groupX = cx - groupW / 2;
                return (
                  <g key={mi}>
                    <rect className="bar-col" x={mi * colW + 4} y={TOP} width={colW - 8} height={chartH}
                      fill={isActive ? "rgba(0,0,0,0.03)" : "transparent"} rx={8}
                      onMouseMove={e => handleMouseMove(e, mi)} onMouseLeave={handleMouseLeave}
                      style={{ cursor: "default" }} />

                    {KPI_SERIES.map((s, si) => {
                      const val = chartData[si][mi] ?? 0;
                      const bh = Math.max((val / 100) * chartH, val > 0 ? 2 : 0);
                      const bx = groupX + si * (barW + barGap);
                      const by = TOP + chartH - bh;
                      const opacity = isActive || activeMonth === null ? 1 : 0.4;
                      const lx = bx + barW / 2;
                      const ly = by - 4;
                      return (
                        <g key={si} onMouseMove={e => handleMouseMove(e, mi)} onMouseLeave={handleMouseLeave}>
                          {/* Shadow */}
                          <rect x={bx} y={by + 4} width={barW} height={bh} rx={5}
                            fill={s.color} opacity={opacity * 0.15} />
                          {/* Bar */}
                          <rect x={bx} y={by} width={barW} height={bh} rx={5}
                            fill={s.color} opacity={opacity} style={{ transition: "opacity 0.2s" }} />
                          {/* Label rotasi vertikal */}
                          {val > 0 && (
                            <text
                              x={lx}
                              y={ly}
                              textAnchor="start"
                              fontSize={9}
                              fontWeight={700}
                              fill="#6b7280"
                              opacity={opacity}
                              transform={`rotate(-60, ${lx}, ${ly})`}
                              style={{ transition: "opacity 0.2s" }}
                            >
                              {val}%
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Month label */}
                    <text x={cx} y={TOP + chartH + 20} textAnchor="middle"
                      fontSize={12} fontWeight={isActive ? 700 : 400}
                      fill={isActive ? "#111827" : "#9ca3af"}>
                      {m}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <p style={{ fontSize: 11, color: "#d1d5db", textAlign: "center", margin: "6px 0 0", letterSpacing: 0.3 }}>
          ← geser untuk navigasi bulan →
        </p>
      </div>

      <Tooltip tooltip={tooltip} data={chartData} />
    </div>
  );
}