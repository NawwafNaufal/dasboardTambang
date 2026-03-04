import { useState, useRef, useEffect, useMemo } from "react";

const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const ALL_UNITS = [
  "U.02","U.03","U.04","U.05","U.06","U.07","U.09","U.10","U.12","U.13",
  "U.16","U.17","U.19","U.20","U.23","U.39","U.40","U.41","U.50","U.51",
  "U.52","U.54","U.55","U.56","U.24","U.25","U.27","U.28","U.29","U.30",
  "U.31","U.32",
];

const KPI_SERIES = [
  { name: "PA", color: "#F87171", data: [7, 8, 15, 18, 12, 10, 14, 9, 11, 13, 16, 8] },
  { name: "MA", color: "#FCD34D", data: [6, 8, 10, 14, 9, 7, 12, 8, 10, 11, 13, 7] },
  { name: "UA", color: "#86EFAC", data: [5, 4, 5, 8, 6, 5, 7, 6, 5, 7, 9, 5] },
  { name: "EU", color: "#FCA5A5", data: [4, 6, 8, 11, 7, 6, 9, 5, 7, 8, 10, 6] },
];

function genData(unit) {
  return KPI_SERIES.map(s => s.data);
}

function UnitSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const filtered = ALL_UNITS.filter(u => u.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); } };
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
        {value}
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
              autoFocus
              style={{ width: "100%", padding: "5px 8px", borderRadius: 8, border: "1.5px solid #e5e7eb",
                fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", padding: 6 }}>
            {filtered.map(u => (
              <div key={u} onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                style={{
                  padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, fontWeight: u === value ? 700 : 400,
                  color: u === value ? "#111827" : "#374151",
                  background: u === value ? "#f3f4f6" : "transparent"
                }}
                onMouseEnter={e => { if (u !== value) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { if (u !== value) e.currentTarget.style.background = "transparent"; }}>
                {u}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Tooltip({ tooltip }) {
  if (!tooltip) return null;
  const { x, y, monthIdx, values } = tooltip;
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
      {values.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: KPI_SERIES[i].color }} />
            <span style={{ fontSize: 13, color: "#6b7280" }}>{KPI_SERIES[i].name}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{v}%</span>
        </div>
      ))}
    </div>
  );
}

export default function SyncKpiChart() {
  const [selectedUnit, setSelectedUnit] = useState(ALL_UNITS[0]);
  const [activeMonth, setActiveMonth] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const scrollRef = useRef(null);

  const data = useMemo(() => genData(selectedUnit), [selectedUnit]);

  useEffect(() => {
    if (scrollRef.current) {
      const mi = new Date().getMonth();
      scrollRef.current.scrollLeft = Math.max(0, mi * 90 - 100);
    }
  }, []);

  const maxVal = useMemo(() => Math.max(...data.flat()) + 5, [data]);

  const handleMouseMove = (e, mi) => {
    setActiveMonth(mi);
    setTooltip({ x: e.clientX, y: e.clientY, monthIdx: mi, values: KPI_SERIES.map((_, si) => data[si][mi]) });
  };
  const handleMouseLeave = () => { setActiveMonth(null); setTooltip(null); };

  const colW = 90;
  const barW = 16;
  const barGap = 4;
  const chartH = 275;
  const groupW = KPI_SERIES.length * (barW + barGap) - barGap;

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
        height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, marginBottom: 2 }}>Bulanan — 2026</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>PA · MA · UA · EU</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Unit</span>
            <UnitSelect value={selectedUnit} onChange={setSelectedUnit} />
          </div>
        </div>

        {/* Scrollable chart */}
        <div
          ref={scrollRef}
          className="kpi-scroll"
          style={{ cursor: "grab", userSelect: "none", paddingBottom: 4, maxWidth: "100%" }}
          onMouseDown={e => {
            const el = scrollRef.current;
            const startX = e.clientX + el.scrollLeft;
            const move = ev => { el.scrollLeft = startX - ev.clientX; };
            const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
        >
          <svg width={months.length * colW} height={chartH + 70} style={{ display: "block" }}>
            {[0, 25, 50, 75, 100].map(pct => {
              const TOP = 20;
              const y = TOP + chartH - (pct / maxVal) * chartH;
              return (
                <g key={pct}>
                  <line x1={0} y1={y} x2={months.length * colW} y2={y} stroke="#f3f4f6" strokeWidth={1} />
                  <text x={4} y={y - 3} fontSize={10} fill="#d1d5db">{pct}</text>
                </g>
              );
            })}

            {months.map((m, mi) => {
              const TOP = 20;
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
                    const val = data[si][mi];
                    const bh = (val / maxVal) * chartH;
                    const bx = groupX + si * (barW + barGap);
                    const by = TOP + chartH - bh;
                    const opacity = isActive || activeMonth === null ? 1 : 0.4;
                    return (
                      <g key={si} onMouseMove={e => handleMouseMove(e, mi)} onMouseLeave={handleMouseLeave}>
                        <rect x={bx} y={by + 4} width={barW} height={bh} rx={5} fill={s.color} opacity={opacity * 0.15} />
                        <rect x={bx} y={by} width={barW} height={bh} rx={5} fill={s.color} opacity={opacity} style={{ transition: "opacity 0.2s" }} />
                        <text x={bx + barW / 2} y={by - 5} textAnchor="middle"
                          fontSize={10} fontWeight={700} fill="#111827" opacity={opacity} style={{ transition: "opacity 0.2s" }}>
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  <text x={cx} y={TOP + chartH + 20} textAnchor="middle"
                    fontSize={12} fontWeight={isActive ? 700 : 400}
                    fill={isActive ? "#111827" : "#9ca3af"}>
                    {m}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p style={{ fontSize: 11, color: "#d1d5db", textAlign: "center", margin: "6px 0 0", letterSpacing: 0.3 }}>
          ← geser untuk navigasi bulan →
        </p>
      </div>

      <Tooltip tooltip={tooltip} />
    </div>
  );
}