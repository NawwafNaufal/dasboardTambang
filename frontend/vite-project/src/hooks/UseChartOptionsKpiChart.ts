import { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import { KpiLabel, KPI_OPTIONS } from "../constants/ConstantsKpiChart";
import { ChartData } from "../interface/TypesKpiChart";

interface UseChartOptionsParams {
  selectedKpi: KpiLabel;
  isDark: boolean;
  isZoomed: boolean;
  chartData: ChartData;
  onZoomed: (zoomed: boolean) => void;
}

export function useChartOptions({
  selectedKpi,
  isDark,
  isZoomed,
  chartData,
  onZoomed,
}: UseChartOptionsParams): ApexOptions {
  const activeKpi = KPI_OPTIONS.find((k) => k.label === selectedKpi)!;
  const textColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#2e2e33" : "#E5E7EB";

  return useMemo<ApexOptions>(
    () => ({
      chart: {
        id: "kpi-single",
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: true, type: "x", autoScaleYaxis: false },
        animations: {
          enabled: true,
          dynamicAnimation: { enabled: true, speed: 350 },
        },
        events: {
          zoomed: (_ctx: any, { xaxis }: { xaxis: { min: number; max: number } }) => {
            onZoomed(xaxis.max - xaxis.min < 25);
          },
          beforeResetZoom: () => {
            onZoomed(false);
            return undefined;
          },
        },
      },
      colors: [activeKpi.color],
      stroke: { curve: "smooth", width: 2.5 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] },
      },
      markers: {
        size: 4,
        colors: [activeKpi.color],
        strokeColors: isDark ? "#1c1c1f" : "#fff",
        strokeWidth: 2,
        hover: { size: 6 },
      },
      dataLabels: {
        enabled: isZoomed,
        background: {
          enabled: true,
          foreColor: activeKpi.color,
          borderRadius: 4,
          padding: 4,
          opacity: 0.9,
          borderWidth: 0,
        },
        style: { fontSize: "10px", fontWeight: 600, colors: ["#ffffff"] },
        offsetY: -18,
        formatter: (value: number) => `${value ?? 0}%`,
      },
      xaxis: {
        categories:
          chartData.days.length > 0
            ? chartData.days
            : Array.from({ length: 31 }, (_, i) => `${i + 1}`),
        labels: { style: { colors: textColor, fontSize: "10px" }, hideOverlappingLabels: true },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
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
        shared: true,
        intersect: false,
        y: { formatter: (v) => `${v ?? 0}%` },
      },
    }),
    [isZoomed, isDark, activeKpi.color, textColor, gridColor, chartData.days]
  );
}