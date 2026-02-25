import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useMemo, useEffect, useRef } from "react";
import ApexChartsLib from "apexcharts";

const gen = (base: number, variance: number) =>
  Array.from({ length: 31 }, () =>
    parseFloat((base + (Math.random() - 0.5) * variance).toFixed(1))
  );

const days = Array.from({ length: 31 }, (_, i) => `${i + 1} Jan`);

const chartData = {
  PA: gen(96, 6),
  MA: gen(95, 5),
  UA: gen(82, 10),
  EU: gen(79, 10),
};

const charts = [
  { id: "kpi-pa", label: "PA — Physical Availability",  data: chartData.PA, color: "#60A5FA" },
  { id: "kpi-ma", label: "MA — Mechanical Availability", data: chartData.MA, color: "#6366F1" },
  { id: "kpi-ua", label: "UA — Use of Availability",     data: chartData.UA, color: "#34D399" },
  { id: "kpi-eu", label: "EU — Effective Utilization",   data: chartData.EU, color: "#F87171" },
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
  const avg = (arr: number[]) =>
    (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);

  // ✅ isZoomed via state → options recompute → react-apexcharts patch internal
  // TIDAK ada chartKey, TIDAK ada remount saat zoom
  const [isZoomed, setIsZoomed] = useState(false);
  const isZoomedRef = useRef(false); // ref untuk cek di dalam event handler

  const textColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#2e2e33" : "#E5E7EB";

  const options: ApexOptions = useMemo(() => ({
    chart: {
      id,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: true, type: "x", autoScaleYaxis: false },
      animations: {
        enabled: true,
        dynamicAnimation: { enabled: true, speed: 350 },
      },
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
      offsetY: -10,
      formatter: (value: number) => (value ? `${value}%` : ""),
    },
    xaxis: {
      categories: days,
      labels: {
        style: { colors: textColor, fontSize: "10px" },
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 50,
      max: 100,
      tickAmount: 5,
      labels: {
        style: { colors: textColor, fontSize: "10px" },
        formatter: (v) => `${v}%`,
      },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      padding: { left: 0, right: 10, top: -10, bottom: 0 },
    },
    legend: { show: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true,
      intersect: false,
      y: { formatter: (v) => `${v}%` },
    },
  }), [isZoomed, isDark, color, id]);

  // ✅ Sidebar fix: setelah transisi selesai, panggil render ulang via ApexCharts.exec
  // TIDAK mengubah chartKey — chart tidak remount, hanya resize
  useEffect(() => {
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "margin-left" || e.propertyName === "width") {
        // Beri waktu layout settle lalu minta ApexCharts recalculate ukuran
        setTimeout(() => {
          ApexChartsLib.exec(id, "updateOptions", {}, false, false);
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
      {/* ✅ Tidak ada chartKey, tidak ada ResizeObserver, tidak ada remount */}
      <div className="w-full max-w-full overflow-hidden">
        <Chart
          options={options}
          series={[{ name: label, data, color }]}
          type="area"
          height={180}
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

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Trend Harian — Januari 2026</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">PA · MA · UA · EU</p>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">Zoom untuk detail angka</span>
      </div>

      <div className="space-y-2">
        {charts.map((c) => (
          <SingleChart
            key={c.id}
            id={c.id}
            label={c.label}
            data={c.data}
            color={c.color}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}