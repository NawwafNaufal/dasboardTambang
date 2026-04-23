import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";

const BASE_URL = "http://moa2.site/api/api";
const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const KPI_SERIES = [
  { name: "PA", color: "#F87171", key: "pa" },
  { name: "MA", color: "#FCD34D", key: "ma" },
  { name: "UA", color: "#86EFAC", key: "ua" },
  { name: "EU", color: "#FCA5A5", key: "eu" },
];

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function UnitSelect({ value, onChange, units }: {
  value: string;
  onChange: (u: string) => void;
  units: string[];
}) {
  const isDark = useDarkMode();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filtered = units.filter(u => u.toLowerCase().includes(search.toLowerCase()));

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

  const colors = {
    btnBg: isDark ? "#1f2937" : "#ffffff",
    btnBorder: isDark ? "#374151" : "#e5e7eb",
    btnText: isDark ? "#f3f4f6" : "#374151",
    dropBg: isDark ? "#1f2937" : "#ffffff",
    dropBorder: isDark ? "#374151" : "#f3f4f6",
    dropShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.13)",
    divider: isDark ? "#374151" : "#f3f4f6",
    inputBg: isDark ? "#111827" : "#ffffff",
    inputBorder: isDark ? "#4b5563" : "#e5e7eb",
    inputText: isDark ? "#f3f4f6" : "#111827",
    itemText: isDark ? "#d1d5db" : "#374151",
    itemActiveText: isDark ? "#f9fafb" : "#111827",
    itemActiveBg: isDark ? "#374151" : "#f3f4f6",
    itemHoverBg: isDark ? "#2d3748" : "#f9fafb",
    arrowColor: isDark ? "#9ca3af" : "#9ca3af",
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 999,
          border: `1.5px solid ${colors.btnBorder}`,
          background: colors.btnBg,
          fontSize: 13, fontWeight: 600, color: colors.btnText,
          cursor: "pointer", fontFamily: "inherit",
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        {value || "Pilih Unit"}
        <svg
          width="10" height="10"
          fill={colors.arrowColor}
          viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
        >
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: colors.dropBg,
          borderRadius: 14,
          boxShadow: colors.dropShadow,
          border: `1px solid ${colors.dropBorder}`,
          zIndex: 999, width: 140, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 10px 6px", borderBottom: `1px solid ${colors.divider}` }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari unit..."
              autoFocus
              style={{
                width: "100%", padding: "5px 8px", borderRadius: 8,
                border: `1.5px solid ${colors.inputBorder}`,
                fontSize: 12, outline: "none",
                boxSizing: "border-box" as const,
                fontFamily: "inherit",
                background: colors.inputBg,
                color: colors.inputText,
              }}
            />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", padding: 6 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "8px 10px", fontSize: 12, color: isDark ? "#6b7280" : "#9ca3af" }}>
                Tidak ada unit
              </div>
            )}
            {filtered.map(u => (
              <div
                key={u}
                onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                style={{
                  padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13,
                  fontWeight: u === value ? 700 : 400,
                  color: u === value ? colors.itemActiveText : colors.itemText,
                  background: u === value ? colors.itemActiveBg : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => {
                  if (u !== value) (e.currentTarget as HTMLDivElement).style.background = colors.itemHoverBg;
                }}
                onMouseLeave={e => {
                  if (u !== value) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                {u}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Tooltip({ tooltip, data, isDark }: { tooltip: any; data: number[][]; isDark: boolean }) {
  if (!tooltip) return null;
  const { x, y, monthIdx } = tooltip;

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      background: isDark ? "#1f2937" : "#ffffff",
      borderRadius: 14,
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.5)"
        : "0 8px 32px rgba(0,0,0,0.14)",
      border: `1px solid ${isDark ? "#374151" : "#f0f0f0"}`,
      padding: "12px 16px",
      zIndex: 9999,
      minWidth: 180,
      pointerEvents: "none",
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? "#f9fafb" : "#111", marginBottom: 8 }}>
        {months[monthIdx]} 2026
      </div>
      {KPI_SERIES.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
            <span style={{ fontSize: 13, color: isDark ? "#9ca3af" : "#6b7280" }}>{s.name}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#f9fafb" : "#111" }}>
            {data[i][monthIdx] ?? 0}%
          </span>
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

  const isDark = useDarkMode();
  const year = 2026;
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState<string[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [chartData, setChartData] = useState<number[][]>(KPI_SERIES.map(() => Array(12).fill(0)));
  const [loadingChart, setLoadingChart] = useState(false);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch units
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

  // Fetch chart data
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

  // Auto-scroll ke bulan saat ini
  useEffect(() => {
    if (scrollRef.current) {
      const mi = new Date().getMonth();
      scrollRef.current.scrollLeft = Math.max(0, mi * 90 - 100);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent, mi: number) => {
    setActiveMonth(mi);
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const tooltipW = 200;
    const tooltipH = 130;
    const padding = 8;

    let x = e.clientX - rect.left + padding;
    let y = e.clientY - rect.top - tooltipH / 2;

    // Flip ke kiri jika keluar batas card kanan
    if (x + tooltipW > rect.width - padding) {
      x = e.clientX - rect.left - tooltipW - padding;
    }
    // Clamp atas/bawah dalam card
    if (y < padding) y = padding;
    if (y + tooltipH > rect.height - padding) y = rect.height - tooltipH - padding;

    setTooltip({ x, y, monthIdx: mi });
  };

  const handleMouseLeave = () => {
    setActiveMonth(null);
    setTooltip(null);
  };

  const colors = {
    cardBg: isDark ? "#111827" : "#ffffff",
    cardBorder: isDark ? "#1f2937" : "#f0f0f0",
    cardShadow: isDark ? "0 2px 16px rgba(0,0,0,0.4)" : "0 2px 16px rgba(0,0,0,0.06)",
    subtitleText: isDark ? "#6b7280" : "#9ca3af",
    titleText: isDark ? "#f9fafb" : "#111827",
    legendText: isDark ? "#9ca3af" : "#6b7280",
    unitLabel: isDark ? "#6b7280" : "#9ca3af",
    loadingText: isDark ? "#6b7280" : "#9ca3af",
    footerText: isDark ? "#374151" : "#d1d5db",
    gridLine: isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
    gridLineTop: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb",
    monthActive: isDark ? "#f9fafb" : "#111827",
    monthInactive: isDark ? "#4b5563" : "#9ca3af",
    barHoverBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.025)",
    barLabelColor: isDark ? "rgba(255,255,255,0.5)" : "#6b7280",
    scrollbarTrack: isDark ? "#1f2937" : "#f9fafb",
    scrollbarThumb: isDark ? "#374151" : "#e5e7eb",
  };

  const colW = 90;
  const barW = 16;
  const barGap = 4;
  const chartH = 230;
  const labelH = 30;
  const groupW = KPI_SERIES.length * (barW + barGap) - barGap;
  const TOP = labelH + 10;

  return (
    // ← wrapper position: relative agar tooltip absolute mengacu ke sini
    <div ref={cardRef} style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", height: "100%", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .kpi-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          max-width: 100%;
        }
        .kpi-scroll::-webkit-scrollbar { height: 4px; }
        .kpi-scroll::-webkit-scrollbar-track {
          background: ${colors.scrollbarTrack};
          border-radius: 2px;
        }
        .kpi-scroll::-webkit-scrollbar-thumb {
          background: ${colors.scrollbarThumb};
          border-radius: 2px;
        }
      `}</style>

      <div style={{
        background: colors.cardBg,
        borderRadius: 24,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.cardShadow,
        padding: "20px 24px 16px",
        height: "100%",
        minHeight: 468,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 12, color: colors.subtitleText, margin: 0, marginBottom: 2, transition: "color 0.3s" }}>
              Bulanan — {year}
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: colors.titleText, margin: 0, transition: "color 0.3s" }}>
              PA · MA · UA · EU
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: colors.unitLabel, fontWeight: 500, transition: "color 0.3s" }}>
              Unit
            </span>
            {loadingUnits ? (
              <span style={{ fontSize: 12, color: colors.loadingText }}>Loading...</span>
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
              <span style={{ fontSize: 12, color: colors.legendText, fontWeight: 500, transition: "color 0.3s" }}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          ref={scrollRef}
          className="kpi-scroll"
          style={{
            cursor: "grab",
            userSelect: "none",
            paddingBottom: 4,
            maxWidth: "100%",
            minHeight: chartH + TOP + 40,
          }}
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
              <span style={{ fontSize: 13, color: colors.loadingText }}>Loading...</span>
            </div>
          ) : (
            <svg
              width={months.length * colW}
              height={chartH + TOP + 40}
              style={{ display: "block" }}
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(pct => {
                const y = TOP + chartH - (pct / 100) * chartH;
                return (
                  <line
                    key={pct}
                    x1={0} y1={y}
                    x2={months.length * colW} y2={y}
                    stroke={pct === 100 ? colors.gridLineTop : colors.gridLine}
                    strokeWidth={1}
                  />
                );
              })}

              {months.map((m, mi) => {
                const cx = mi * colW + colW / 2;
                const isActive = activeMonth === mi;
                const groupX = cx - groupW / 2;

                return (
                  <g key={mi}>
                    <rect
                      x={mi * colW + 4} y={TOP}
                      width={colW - 8} height={chartH}
                      fill={isActive ? colors.barHoverBg : "transparent"}
                      rx={8}
                      onMouseMove={e => handleMouseMove(e, mi)}
                      onMouseLeave={handleMouseLeave}
                      style={{ cursor: "default" }}
                    />

                    {KPI_SERIES.map((s, si) => {
                      const val = chartData[si][mi] ?? 0;
                      const bh = Math.max((val / 100) * chartH, val > 0 ? 2 : 0);
                      const bx = groupX + si * (barW + barGap);
                      const by = TOP + chartH - bh;
                      const opacity = isActive || activeMonth === null ? 1 : 0.35;
                      const lx = bx + barW / 2;
                      const ly = by - 4;

                      return (
                        <g key={si} onMouseMove={e => handleMouseMove(e, mi)} onMouseLeave={handleMouseLeave}>
                          <rect
                            x={bx} y={by + 4}
                            width={barW} height={bh}
                            rx={5}
                            fill={s.color}
                            opacity={opacity * 0.15}
                          />
                          <rect
                            x={bx} y={by}
                            width={barW} height={bh}
                            rx={5}
                            fill={s.color}
                            opacity={opacity}
                            style={{ transition: "opacity 0.2s" }}
                          />
                          {val > 0 && (
                            <text
                              x={lx} y={ly}
                              textAnchor="start"
                              fontSize={9}
                              fontWeight={700}
                              fill={colors.barLabelColor}
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

                    <text
                      x={cx} y={TOP + chartH + 20}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={isActive ? 700 : 400}
                      fill={isActive ? colors.monthActive : colors.monthInactive}
                      style={{ transition: "fill 0.2s" }}
                    >
                      {m}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <p style={{
          fontSize: 11,
          color: colors.footerText,
          textAlign: "center",
          margin: "6px 0 0",
          letterSpacing: 0.3,
          transition: "color 0.3s",
        }}>
          ← geser untuk navigasi bulan →
        </p>
      </div>

      {/* Tooltip di dalam wrapper position:relative, pakai position:absolute */}
      <Tooltip tooltip={tooltip} data={chartData} isDark={isDark} />
    </div>
  );
}