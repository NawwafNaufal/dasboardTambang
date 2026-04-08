import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { ApexOptions } from "apexcharts";
import MonthlyTargetChart from "../../components/MonthlyTarget/MonthlyTargetChart";
import MonthlyTargetStats from "../../components/MonthlyTarget/MonthlyTargetStats";
import MonthlyTargetHeader from "../../components/MonthlyTarget/MonthlyTargetHeader";
import LoadingState from "../../components/MonthlyTarget/LoadingState";
import EmptyState from "../../components/MonthlyTarget/EmptyState";
import { useMonthlyTargetData } from "../../hooks/useMonthlyTargetData";
import { getCurrentActivityData } from "../../utils/monthlyTargetUtils";
import type { MonthlyTargetProps } from "../../interface/monthlyTarget";

export default function MonthlyTarget({
  selectedPT = "PT Semen Tonasa",
  currentActivity,
}: MonthlyTargetProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [chartKey, setChartKey] = useState(0);
  const [chartHeight, setChartHeight] = useState(330);
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentYear = new Date().getFullYear();
  const { data, loading, error } = useMonthlyTargetData(selectedPT, selectedMonth, currentYear);

  useEffect(() => {
    console.log("🎯 [MonthlyTarget] currentActivity changed to:", currentActivity);
  }, [currentActivity]);

  const updateSize = useCallback(() => {
    if (!chartRef.current) return;
    const width = chartRef.current.getBoundingClientRect().width;
    const newHeight = Math.min(Math.max(width * 0.85, 280), 330);
    setChartHeight(newHeight);
    setChartKey((prev) => prev + 1);
  }, []);

  useLayoutEffect(() => {
    updateSize();
  }, [updateSize]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateSize, 300);
    };

    // Observe body untuk detect layout shift
    const bodyObserver = new ResizeObserver(handleResize);
    bodyObserver.observe(document.body);

    // Observe sidebar TailAdmin langsung
    const sidebar = document.querySelector("aside") || document.querySelector("nav");
    let sidebarObserver: ResizeObserver | null = null;
    if (sidebar) {
      sidebarObserver = new ResizeObserver(handleResize);
      sidebarObserver.observe(sidebar);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      bodyObserver.disconnect();
      sidebarObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [updateSize]);

  if (loading) {
    return (
      <div className="w-full">
        <LoadingState chartRef={chartRef} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full">
        <EmptyState
          chartRef={chartRef}
          selectedPT={selectedPT}
          selectedMonth={selectedMonth}
          currentYear={currentYear}
          onMonthChange={setSelectedMonth}
        />
      </div>
    );
  }

  const currentData = getCurrentActivityData(data, currentActivity);
  const series = [currentData.percentage];

  const options: ApexOptions = {
    colors: ["#F87171"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: chartHeight,
      width: "100%",
      sparkline: { enabled: true },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "80%" },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => val.toFixed(2) + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#60A5FA"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  return (
    <div
      ref={chartRef}
      className="w-full rounded-2xl border h-full border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out flex flex-col"
    >
      <div className="flex-1 flex flex-col px-5 pt-5 bg-white shadow-default rounded-t-2xl dark:bg-gray-900 sm:px-6 sm:pt-6 transition-all duration-300 ease-in-out overflow-hidden">
        <MonthlyTargetHeader
          siteName={data.site}
          currentActivity={currentActivity}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <MonthlyTargetChart
          options={options}
          series={series}
          currentData={currentData}
          selectedPT={selectedPT}
          currentActivity={currentActivity}
          chartKey={chartKey}
          chartHeight={chartHeight}
        />
      </div>
      <MonthlyTargetStats currentData={currentData} />
    </div>
  );
}