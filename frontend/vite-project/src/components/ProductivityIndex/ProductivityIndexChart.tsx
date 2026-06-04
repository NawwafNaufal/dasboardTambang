import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";

import { MONTHS, METRICS } from "../../constants/ConstantsProductivityIndex";
import { T } from "../../constants/ThemeProductivityIndex";
import { useDarkMode, useUnits, useMetrics } from "../../hooks/ProductivityIndex/HooksProductivityIndex";
import { useDonutSlices } from "../../hooks/ProductivityIndex/UseDonutSlicesProductivityIndex";
import { UnitSelectProductivityIndex } from "./UnitSelectProductivityIndex";
import { DonutChartProductivityIndex } from "./DonutChartProductivityIndex";

interface OutletContext {
  selectedPT: string;
  currentUnitActivity: string;
}

export default function ProductivityIndexChart() {
  const { selectedPT, currentUnitActivity } = useOutletContext<OutletContext>();

  const dark = useDarkMode();
  const t = dark ? T.dark : T.light;

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { units, selectedUnit, setSelectedUnit, loading: loadingUnits } =
    useUnits(selectedPT, currentUnitActivity);

  const { metrics, loading: loadingMetrics } =
    useMetrics(selectedPT, currentUnitActivity, selectedUnit, selectedMonth);

  const { slices, totalValue } = useDonutSlices(metrics);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowMonthPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  return (
    <div style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: t.bg,
      borderRadius: 24,
      border: `1px solid ${t.border}`,
      boxShadow: t.shadow,
      padding: "20px 22px 18px",
      height: "100%",
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      zIndex: 0,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 2, color: t.labelUpper,
            textTransform: "uppercase", margin: 0,
          }}>
            Produktivity Index
          </p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.title, margin: "2px 0 0" }}>
            Average
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Month Picker */}
          <div ref={pickerRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px", borderRadius: 999,
                border: `1px solid ${t.btnBorder}`, background: t.btnBg,
                fontSize: 12, fontWeight: 600, color: t.btnColor,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={t.label} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {MONTHS[selectedMonth]}
              <svg
                width="9" height="9" fill={t.label} viewBox="0 0 16 16"
                style={{ transform: showMonthPicker ? "rotate(180deg)" : "none", transition: "transform .2s" }}
              >
                <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </button>

            {showMonthPicker && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 9999,
                background: t.pickerBg, border: `1px solid ${t.pickerBorder}`,
                borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                padding: 8, display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                gap: 4, width: 160,
              }}>
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMonth(i); setShowMonthPicker(false); }}
                    style={{
                      fontSize: 11, padding: "6px 4px", borderRadius: 8,
                      fontWeight: 600, border: "none",
                      background: selectedMonth === i ? "#fd9141" : "transparent",
                      color: selectedMonth === i ? "#fff" : t.pickerText,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unit Picker */}
          {loadingUnits ? (
            <span style={{ fontSize: 12, color: t.label }}>Loading...</span>
          ) : (
            <UnitSelectProductivityIndex
              value={selectedUnit}
              onChange={setSelectedUnit}
              units={units}
              t={t as typeof T.light}
            />
          )}
        </div>
      </div>

      {/* Donut Chart */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", overflow: "hidden", padding: "8px 0",
      }}>
        {loadingMetrics ? (
          <span style={{ fontSize: 13, color: t.label }}>Loading...</span>
        ) : (
          <DonutChartProductivityIndex slices={slices} size={220} t={t as typeof T.light} totalValue={totalValue} />
        )}
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

      {/* Average Strip */}
      <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {(metrics.length > 0 ? metrics : METRICS.map((m) => ({ label: m.label, avg: 0 }))).map((m) => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: t.labelUpper,
                textTransform: "uppercase", margin: "0 0 4px",
              }}>
                {m.label}
              </p>
              <p style={{ fontSize: 10, color: t.label, margin: "0 0 2px" }}>Average</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: t.value, margin: 0 }}>
                {loadingMetrics ? "..." : m.avg}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}