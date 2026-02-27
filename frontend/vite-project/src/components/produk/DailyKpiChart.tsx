import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useMemo, useEffect, useRef } from "react";
import * as ApexChartsLib from "apexcharts";

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
const months: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const gen = (base: number, variance: number) =>
  Array.from({ length: 31 }, () =>
    parseFloat((base + (Math.random() - 0.5) * variance).toFixed(1))
  );

const generateChartData = () => ({
  PA: gen(96, 6),
  MA: gen(95, 5),
  UA: gen(82, 10),
  EU: gen(79, 10),
});

const charts = [
  { id: "kpi-pa", label: "PA", color: "#60A5FA" },
  { id: "kpi-ma", label: "MA", color: "#FACC15" },
  { id: "kpi-ua", label: "UA", color: "#4ADE80" },
  { id: "kpi-eu", label: "EU", color: "#F87171" },
];

function SingleChart({
  id, label, data, color, isDark,
}: {
  id: string;
  label: string;
  data: number[];
  color: string;
  isDark: boolean;
}) {
  const avg = (arr: number[]) => {
    if (!arr || arr.length === 0) return "0.0";
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  };

  const [isZoomed, setIsZoomed] = useState(false);
  const isZoomedRef = useRef(false);
  const textColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#2e2e33" : "#E5E7EB";

  const options: ApexOptions = useMemo(() => ({
    chart: {
      id,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: true, type: "x", autoScaleYaxis: false },
      animations: { enabled: true, dynamicAnimation: { enabled: true, speed: 350 } },
      events: {
        zoomed: (_ctx: any, { xaxis }: { xaxis: { min: number; max: number } }) => {
          const zoomed = (xaxis.max - xaxis.min) < 25;
          isZoomedRef.current = zoomed;
          setIsZoomed(zoomed);
        },
        beforeResetZoom: () => {
          isZoomedRef.current = false;
          setIsZoomed(false);
          return undefined;
        },
      },
    },
    colors: [color],
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] },
    },
    markers: {
      size: 4,
      colors: [color],
      strokeColors: isDark ? "#1c1c1f" : "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: {
      enabled: isZoomed,
      background: {
        enabled: true,
        foreColor: color,
        borderRadius: 4,
        padding: 4,
        opacity: 0.9,
        borderWidth: 0,
      },
      style: { fontSize: "10px", fontWeight: 600, colors: ["#ffffff"] },
      offsetY: -18,
      offsetX: 0,
      formatter: (value: number) => (value ? `${value}%` : ""),
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
      labels: { style: { colors: textColor, fontSize: "10px" }, hideOverlappingLabels: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 50, max: 100, tickAmount: 5,
      labels: {
        style: { colors: textColor, fontSize: "10px" },
        formatter: (v) => `${v}%`,
        offsetX: -8,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      padding: { left: 40, right: 10, top: 30, bottom: 0 },
    },
    legend: { show: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true, intersect: false,
      y: { formatter: (v) => `${v}%` },
    },
  }), [isZoomed, isDark, color, id]);

  useEffect(() => {
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "margin-left" || e.propertyName === "width") {
        setTimeout(() => {
          (ApexChartsLib as any).exec(id, "updateOptions", {}, false, false);
        }, 100);
      }
    };
    document.addEventListener("transitionend", onTransitionEnd);
    return () => document.removeEventListener("transitionend", onTransitionEnd);
  }, [id]);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl px-3 pt-2 pb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        <span className="text-xs text-gray-400">avg {avg(data)}%</span>
      </div>
      <div className="w-full max-w-full overflow-hidden">
        <Chart
          options={options}
          series={[{ name: label, data: data ?? [], color }]}
          type="area"
          height={220}
          width="100%"
        />
      </div>
    </div>
  );
}

export default function SyncKpiChart() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const [selectedMonth, setSelectedMonth] = useState<Month>("Jan");
  const [chartData, setChartData] = useState(generateChartData);

  useEffect(() => {
    setChartData(generateChartData());
  }, [selectedMonth]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const dataMap: Record<string, number[]> = {
    "kpi-pa": chartData.PA,
    "kpi-ma": chartData.MA,
    "kpi-ua": chartData.UA,
    "kpi-eu": chartData.EU,
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Trend Harian — {selectedMonth} 2026</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">PA · MA · UA · EU</p>
        </div>

        <div className="flex gap-1 flex-nowrap overflow-x-auto">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`text-xs px-2 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedMonth === m
                  ? "bg-brand-500 text-white"
                  : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {charts.map((c) => (
          <SingleChart
            key={c.id}
            id={c.id}
            label={c.label}
            data={dataMap[c.id]}
            color={c.color}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}