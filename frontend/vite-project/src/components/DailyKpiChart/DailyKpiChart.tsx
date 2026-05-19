import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import * as ApexChartsLib from "apexcharts";

import { MONTHS, KPI_OPTIONS, KpiLabel, Month } from "../../constants/ConstantsKpiChart";
import { useDarkMode, useUnits, useChartData } from "../../hooks/useSkpiChart";
import { useChartOptions } from "../../hooks/UseChartOptionsKpiChart";
import { UnitSelect } from "./UnitSelectKpiChart";


interface OutletContext {
  currentUnitActivity: string;
}

interface DailyKpiChartProps {
  selectedPT: string;
}

export default function DailyKpiChart({ selectedPT }: DailyKpiChartProps) {
  const { currentUnitActivity } = useOutletContext<OutletContext>();

  const isDark = useDarkMode();

  const [selectedMonth, setSelectedMonth] = useState<Month>(
    MONTHS[new Date().getMonth()]
  );
  const [selectedKpi, setSelectedKpi] = useState<KpiLabel>("PA");
  const [isZoomed, setIsZoomed] = useState(false);

  const { units, selectedUnit, setSelectedUnit, loading: loadingUnits } =
    useUnits(selectedPT, currentUnitActivity);

  const { chartData, loading: loadingChart } = useChartData(
    selectedPT,
    currentUnitActivity,
    selectedUnit,
    selectedMonth
  );

  const options = useChartOptions({
    selectedKpi,
    isDark,
    isZoomed,
    chartData,
    onZoomed: setIsZoomed,
  });

  useEffect(() => {
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "margin-left" || e.propertyName === "width") {
        setTimeout(() => {
          (ApexChartsLib as any).exec("kpi-single", "updateOptions", {}, false, false);
        }, 100);
      }
    };
    document.addEventListener("transitionend", onTransitionEnd);
    return () => document.removeEventListener("transitionend", onTransitionEnd);
  }, []);

  const activeKpi = KPI_OPTIONS.find((k) => k.label === selectedKpi)!;
  const seriesData = (chartData[selectedKpi] ?? []).map((v) => v ?? 0);

  const avgMap: Record<KpiLabel, number> = {
    PA: chartData.summary.avgPA,
    MA: chartData.summary.avgMA,
    UA: chartData.summary.avgUA,
    EU: chartData.summary.avgEU,
  };
  const avg = avgMap[selectedKpi];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">

      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trend Harian — {selectedMonth} 2026
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            <span style={{ color: activeKpi.color }}>{selectedKpi}</span>
            {selectedUnit && (
              <span className="text-gray-400 font-normal text-base"> · {selectedUnit}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
          {/* Month picker — desktop */}
          <div className="hidden md:flex items-center" style={{ gap: 2 }}>
            {MONTHS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  background: selectedMonth === m ? "#3B82F6" : "transparent",
                  color: selectedMonth === m ? "#fff" : "#9ca3af",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Month picker — mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value as Month)}
              style={{
                padding: "5px 10px",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                background: "#fff",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

          {/* Unit selector */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Unit:</span>
            {loadingUnits ? (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Loading...</span>
            ) : (
              <UnitSelect value={selectedUnit} onChange={setSelectedUnit} units={units} />
            )}
          </div>
        </div>
      </div>

      {/* KPI Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {KPI_OPTIONS.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => setSelectedKpi(kpi.label)}
            style={{
              backgroundColor: kpi.color,
              color: "#fff",
              opacity: selectedKpi === kpi.label ? 1 : 0.35,
              border: "none",
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transform: selectedKpi === kpi.label ? "scale(1)" : "scale(0.95)",
              transition: "all 0.15s",
            }}
          >
            {kpi.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          avg{" "}
          <span style={{ color: activeKpi.color, fontWeight: 600 }}>
            {loadingChart ? "..." : `${avg.toFixed(1)}%`}
          </span>
        </span>
      </div>

      {/* Chart */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-xl px-3 pt-2 pb-0">
        <div className="w-full max-w-full overflow-hidden">
          {loadingChart ? (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="text-gray-400 text-sm">Loading...</span>
            </div>
          ) : chartData.days.length === 0 ? (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="text-gray-400 text-sm">Tidak ada data untuk periode ini</span>
            </div>
          ) : (
            <Chart
              options={options}
              series={[{ name: selectedKpi, data: seriesData, color: activeKpi.color }]}
              type="area"
              height={300}
              width="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
}