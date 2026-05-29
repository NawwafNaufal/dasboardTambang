import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router";

import { MONTHS, TABS, Tab, Month } from "@/constants/ConstantsDailyProduct";
import { useUnits, useDailyData, useDarkMode } from "@/hooks/HooksDailyProduct";
import { useTabConfig } from "@/hooks/UseTabConfigDailyProduct";
import { useSidebar } from "../../context/SidebarContext";
import { SingleSelectDailyProduct } from "./SingleSelectDailyProduct";
import { pctChange } from "../../utils/UtilsDailyProduct";

interface OutletContext {
  selectedPT: string;
  currentUnitActivity: string;
}


const TAB_ICONS: Record<Tab, React.ReactNode> = {
  productivity: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
    </svg>
  ),
  fuel: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M3 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z" />
      <path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1c.564 0 1.034.11 1.402.328.37.22.64.546.79.97.295.836.205 1.987.2 3.182v.006l-.002 2.29a.5.5 0 0 1-.498.5H15v4.5a1.5 1.5 0 0 1-3 0V12a2 2 0 0 1-2-2V2zm9 0a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13h8zm-4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
    </svg>
  ),
};

export default function DailyProduct() {
  const { selectedPT, currentUnitActivity } = useOutletContext<OutletContext>();
  const { isExpanded, isHovered } = useSidebar();

  const isDark = useDarkMode();
  const textColor = isDark ? "#aaaaaa" : "#6b7280";
  const gridColor = isDark ? "#2e2e33" : "#e5e7eb";

  const [tab, setTab] = useState<Tab>("productivity");
  const [selectedMonth, setSelectedMonth] = useState<Month>(MONTHS[new Date().getMonth()]);
  const [isLtrMtrVisible, setIsLtrMtrVisible] = useState(true);

  const { units, selectedUnit, setSelectedUnit, loading: loadingUnits } =
    useUnits(selectedPT, currentUnitActivity);

  const { dailyData, loading: loadingData } =
    useDailyData(selectedPT, currentUnitActivity, selectedUnit, selectedMonth);

  const tabConfig = useTabConfig(dailyData);
  const cfg = tabConfig[tab];

  const mainPct = pctChange(cfg.mainData);
  const isPositive = Number(mainPct) >= 0;
  const tooManyPoints = dailyData.days.length > 15;

  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event("resize")), 350);
    return () => clearTimeout(timer);
  }, [isExpanded, isHovered]);

  useEffect(() => {
    setIsLtrMtrVisible(true);
  }, [tab, selectedMonth, selectedUnit]);

  const dynamicYaxis = useMemo(() => {
    if (tab !== "productivity") {
      return cfg.yaxis;
    }

    if (isLtrMtrVisible) {
      return [
        {
          seriesName: "Lbg/Jam", min: 0, tickAmount: 5,
          labels: { style: { colors: "#fd9141", fontSize: "11px" }, formatter: (v: number) => v.toFixed(1) },
          title: { text: "Lbg/Jam", style: { color: "#fd9141", fontWeight: 600 } },
        },
        {
          seriesName: "Mtr/Jam", opposite: false, show: false, min: 0
        },
        {
          seriesName: "Ltr/Mtr", opposite: true, min: 0, tickAmount: 5,
          labels: { style: { colors: "#FACC15", fontSize: "11px" }, formatter: (v: number) => v.toFixed(3) },
          title: { text: "Ltr/Mtr", style: { color: "#FACC15", fontWeight: 600 } },
        },
      ];
    } else {
      return [
        {
          seriesName: "Lbg/Jam", min: 0, tickAmount: 5,
          labels: { style: { colors: "#fd9141", fontSize: "11px" }, formatter: (v: number) => v.toFixed(1) },
          title: { text: "Lbg/Jam", style: { color: "#fd9141", fontWeight: 600 } },
        },
        {
          seriesName: "Mtr/Jam", opposite: true, show: true, min: 0, tickAmount: 5,
          labels: { style: { colors: "#34D399", fontSize: "11px" }, formatter: (v: number) => v.toFixed(1) },
          title: { text: "Mtr/Jam", style: { color: "#34D399", fontWeight: 600 } },
        },
        {
          seriesName: "Ltr/Mtr", opposite: true, show: false, min: 0
        },
      ];
    }
  }, [tab, isLtrMtrVisible, cfg.yaxis]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, speed: 600 },
      events: {
        legendClick: (chartContext: any, seriesIndex: number, config: any) => {
          if (tab === "productivity" && seriesIndex === 2) {
            setTimeout(() => {
              const isVisible = chartContext.w.globals.seriesVisible[seriesIndex];
              setIsLtrMtrVisible(isVisible);
            }, 50);
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        if (tooManyPoints && opts.dataPointIndex % 2 !== 0) return "";
        return cfg.dataLabelFormatter(val, opts);
      },
      style: {
        fontSize: "10px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: "700",
        colors: cfg.dataLabelColors,
      },
      background: {
        enabled: true,
        foreColor: isDark ? "#111827" : "#ffffff",
        padding: 3,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        opacity: 0.85,
        dropShadow: { enabled: false },
      },
      offsetY: -8,
    },
    stroke: { curve: "smooth", width: [2.5, 2.5, 2.5] },
    colors: cfg.colors,
    markers: { size: 4, hover: { size: 6 } },
    xaxis: {
      categories: dailyData.days,
      labels: { style: { colors: textColor, fontSize: "11px" }, rotate: 0 },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: { text: "Hari", style: { color: textColor, fontSize: "11px" } },
    },
    yaxis: dynamicYaxis as ApexOptions["yaxis"],
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { top: 20, right: 10 } },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: { colors: textColor },
      markers: { size: 6 },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true,
      intersect: false,
      y: { formatter: cfg.tooltipFormatter },
    },
  };


  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{cfg.title}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Trend harian input terakhir bulan ini</p>
        </div>
        <div className="flex items-center gap-6">
          {loadingData ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : (
            cfg.stats.map((s) => {
              const p = pctChange(s.data);
              const pos = Number(p) >= 0;
              return (
                <div key={s.label} className="flex flex-col">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-800 dark:text-white">
                      {s.data.length > 0 ? s.value.toFixed(s.dec) : "—"}
                    </span>
                    {s.data.length > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        pos
                          ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"
                      }`}>
                        {pos ? "+" : ""}{p}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tab Row */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {/* Unit Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1">
          <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Unit:</span>
          {loadingUnits ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : (
            <SingleSelectDailyProduct options={units} value={selectedUnit} onChange={setSelectedUnit} />
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex px-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold underline-offset-4 transition-all ${
                tab === t
                  ? "underline decoration-2 decoration-[#fd9141] text-[#fd9141]"
                  : "no-underline text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {TAB_ICONS[t]}
              {t === "productivity" ? "Productivity" : "Fuel"}
            </button>
          ))}
        </div>
      </div>

      {/* Plan display */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800">
        {loadingData ? (
          <p className="text-4xl font-bold text-gray-300">Loading...</p>
        ) : (
          <>
            <p className={`text-8xl tracking-tighter leading-none font-bold ${cfg.mainColor}`}>
              {dailyData.plan > 0 ? dailyData.plan : "—"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Plan · {selectedUnit} · {selectedMonth} 2026
              </span>
              {cfg.mainData.length > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isPositive
                    ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300"
                }`}>
                  {isPositive ? "+" : ""}{mainPct}%
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="p-4 md:p-6">
        {loadingData ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="text-gray-400 text-sm">Loading chart...</span>
          </div>
        ) : dailyData.days.length === 0 ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="text-gray-400 text-sm">Tidak ada data untuk periode ini</span>
          </div>
        ) : (
          // @ts-ignore
          <Chart options={options} series={cfg.series} type="line" height={300} />
        )}

        {/* Month Picker */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {MONTHS.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedMonth === m
                      ? "bg-[#fd9141] text-white"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}