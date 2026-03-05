import { useMemo, useState, useRef, useEffect } from "react";

const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const ALL_UNITS = [
  "U.02","U.03","U.04","U.05","U.06","U.07","U.09","U.10","U.12","U.13",
  "U.16","U.17","U.19","U.20","U.23","U.39","U.40","U.41","U.50","U.51",
  "U.52","U.54","U.55","U.56","U.24","U.25","U.27","U.28","U.29","U.30",
  "U.31","U.32",
];

const METRICS = [
  { label: "Lbg/Jam", color: "#4ADE80" },
  { label: "Mtr/Jam", color: "#F97B5A" },
  { label: "Ltr/Mtr", color: "#FBBF24" },
];

const FIXED_PCTS = [50, 15, 35];

const generateMonthlyMetrics = (monthIdx) => {
  const seed = monthIdx + 1;
  return [
    { label: "Lbg/Jam", value: parseFloat((6 + seed * 0.3).toFixed(2)),      avg: parseFloat((5 + seed * 0.2).toFixed(2)) },
    { label: "Mtr/Jam", value: parseFloat((38 + seed * 0.8).toFixed(2)),     avg: parseFloat((35 + seed * 0.6).toFixed(2)) },
    { label: "Ltr/Mtr", value: parseFloat((0.75 + seed * 0.006).toFixed(3)), avg: parseFloat((0.68 + seed * 0.005).toFixed(3)) },
  ];
};

// Detect dark mode from document
function useDarkMode() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

const T = {
  light: {
    bg: "#ffffff", border: "#f0f0f0", shadow: "0 2px 16px rgba(0,0,0,0.07)",
    label: "#6b7280", labelUpper: "#9ca3af", title: "#111827", value: "#111827",
    divider: "#f3f4f6", btnBorder: "#e5e7eb", btnBg: "#f9fafb", btnColor: "#374151",
    bubbleBg: "#ffffff", bubbleBorder: "#e5e7eb", bubbleText: "#374151",
    centerText: "#111827", centerSub: "#9ca3af",
    pickerBg: "#ffffff", pickerBorder: "#e5e7eb", pickerText: "#6b7280",
  },
  dark: {
    bg: "#111827", border: "rgba(255,255,255,0.08)", shadow: "0 4px 32px rgba(0,0,0,0.4)",
    label: "#9ca3af", labelUpper: "#6b7280", title: "#ffffff", value: "#ffffff",
    divider: "rgba(255,255,255,0.08)", btnBorder: "rgba(255,255,255,0.12)",
    btnBg: "rgba(255,255,255,0.06)", btnColor: "#e5e7eb",
    bubbleBg: "#1f2937", bubbleBorder: "rgba(255,255,255,0.1)", bubbleText: "#e5e7eb",
    centerText: "#ffffff", centerSub: "rgba(255,255,255,0.4)",
    pickerBg: "#1f2937", pickerBorder: "rgba(255,255,255,0.1)", pickerText: "#9ca3af",
  }
};

function UnitSelect({ value, onChange, t }) {
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
        display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999,
        border: `1px solid ${t.btnBorder}`, background: t.btnBg, fontSize: 12, fontWeight: 600,
        color: t.btnColor, cursor: "pointer", fontFamily: "inherit"
      }}>
        {value}
        <svg width="9" height="9" fill={t.label} viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, background: t.pickerBg,
          borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          border: `1px solid ${t.pickerBorder}`, zIndex: 999, width: 130, overflow: "hidden"
        }}>
          <div style={{ padding: "8px 8px 6px", borderBottom: `1px solid ${t.pickerBorder}` }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari unit..."
              autoFocus style={{ width: "100%", padding: "4px 8px", borderRadius: 7,
                border: `1px solid ${t.btnBorder}`, fontSize: 12, outline: "none",
                background: t.btnBg, color: t.btnColor, boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ maxHeight: 190, overflowY: "auto", padding: 5 }}>
            {filtered.map(u => (
              <div key={u} onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                style={{ padding: "6px 10px", borderRadius: 7, cursor: "pointer", fontSize: 12,
                  fontWeight: u === value ? 700 : 400, color: u === value ? t.title : t.pickerText,
                  background: u === value ? t.btnBg : "transparent" }}
                onMouseEnter={e => { if (u !== value) e.currentTarget.style.background = t.btnBg; }}
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

function DonutChart({ slices, size, t }) {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.42;
  const r = size * 0.24;
  const GAP = 3.5;
  const toRad = d => (d * Math.PI) / 180;
  const total = slices.reduce((s, x) => s + x.pct, 0);
  const minPct = Math.min(...slices.map(s => s.pct));
  const paths = [];
  let start = -90;

  slices.forEach(sl => {
    const isSmallest = sl.pct === minPct;
    const pop = isSmallest ? 10 : 0; // push smallest segment outward
    const span = (sl.pct / total) * 360 - GAP;
    const end = start + span;
    const mid = start + span / 2;
    const midRad = toRad(mid);
    const ox = pop * Math.cos(midRad); // offset x
    const oy = pop * Math.sin(midRad); // offset y

    const x1o = cx + ox + R * Math.cos(toRad(start)), y1o = cy + oy + R * Math.sin(toRad(start));
    const x2o = cx + ox + R * Math.cos(toRad(end)),   y2o = cy + oy + R * Math.sin(toRad(end));
    const x1i = cx + ox + r * Math.cos(toRad(end)),   y1i = cy + oy + r * Math.sin(toRad(end));
    const x2i = cx + ox + r * Math.cos(toRad(start)), y2i = cy + oy + r * Math.sin(toRad(start));
    const lg = span > 180 ? 1 : 0;
    const d = `M${x1o} ${y1o} A${R} ${R} 0 ${lg} 1 ${x2o} ${y2o} L${x1i} ${y1i} A${r} ${r} 0 ${lg} 0 ${x2i} ${y2i}Z`;

    // Bubble sits on the outer arc midpoint
    const lr = R + 2;
    const lx = cx + ox + lr * Math.cos(midRad);
    const ly = cy + oy + lr * Math.sin(midRad);
    paths.push({ d, color: sl.color, pct: sl.pct, lx, ly });
    start += span + GAP;
  });

  return (
    <svg width={size + 100} height={size + 100} style={{ overflow: "visible" }}>
      <g transform="translate(50,50)">
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}

        {/* Center */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={28} fontWeight={800} fill={t.centerText}
          style={{ fontFamily: "'DM Sans',sans-serif" }}>100%</text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize={11} fill={t.centerSub}
          style={{ fontFamily: "'DM Sans',sans-serif" }}>Total</text>

        {/* Bubble labels */}
        {paths.map((p, i) => (
          <g key={`b${i}`}>
            <circle cx={p.lx} cy={p.ly} r={23} fill={t.bubbleBg}
              stroke={t.bubbleBorder} strokeWidth={1.5} />
            <text x={p.lx} y={p.ly + 4} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={t.bubbleText} style={{ fontFamily: "'DM Sans',sans-serif" }}>
              {p.pct.toFixed(1)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function ProductivityIndexChart() {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(ALL_UNITS[0]);
  const dark = useDarkMode();
  const t = dark ? T.dark : T.light;
  const pickerRef = useRef(null);

  const metrics = useMemo(() => generateMonthlyMetrics(selectedMonth), [selectedMonth]);
  const slices = METRICS.map((m, i) => ({ pct: FIXED_PCTS[i], color: m.color }));

  useEffect(() => {
    const h = e => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowMonthPicker(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif", background: t.bg,
      borderRadius: 24, border: `1px solid ${t.border}`, boxShadow: t.shadow,
      padding: "20px 22px 18px", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: t.labelUpper,
            textTransform: "uppercase", margin: 0 }}>Produktivity Index</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.title, margin: "2px 0 0" }}>Total Bulanan</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Month picker */}
          <div ref={pickerRef} style={{ position: "relative" }}>
            <button onClick={() => setShowMonthPicker(!showMonthPicker)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999,
              border: `1px solid ${t.btnBorder}`, background: t.btnBg, fontSize: 12, fontWeight: 600,
              color: t.btnColor, cursor: "pointer", fontFamily: "inherit"
            }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={t.label} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {months[selectedMonth]}
              <svg width="9" height="9" fill={t.label} viewBox="0 0 16 16"
                style={{ transform: showMonthPicker ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </button>
            {showMonthPicker && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50,
                background: t.pickerBg, border: `1px solid ${t.pickerBorder}`, borderRadius: 14,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)", padding: 8,
                display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: 160
              }}>
                {months.map((m, i) => (
                  <button key={m} onClick={() => { setSelectedMonth(i); setShowMonthPicker(false); }}
                    style={{
                      fontSize: 11, padding: "6px 4px", borderRadius: 8, fontWeight: 600, border: "none",
                      background: selectedMonth === i ? "#3b82f6" : "transparent",
                      color: selectedMonth === i ? "#fff" : t.pickerText,
                      cursor: "pointer", fontFamily: "inherit"
                    }}>{m}</button>
                ))}
              </div>
            )}
          </div>
          <UnitSelect value={selectedUnit} onChange={setSelectedUnit} t={t} />
        </div>
      </div>

      {/* Donut */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DonutChart slices={slices} size={260} t={t} />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 14 }}>
        {METRICS.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: m.color }} />
            <span style={{ fontSize: 12, color: t.label }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Avg strip */}
      <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: t.labelUpper,
                textTransform: "uppercase", margin: "0 0 4px" }}>{m.label}</p>
              <p style={{ fontSize: 10, color: t.label, margin: "0 0 2px" }}>Average</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: t.value, margin: 0 }}>{m.avg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}