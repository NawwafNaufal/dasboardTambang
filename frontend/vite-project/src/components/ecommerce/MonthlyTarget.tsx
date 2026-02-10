import { useState, useEffect, useRef } from "react";
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
  currentActivity
}: MonthlyTargetProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentYear = new Date().getFullYear();
  const { data, loading, error } = useMonthlyTargetData(selectedPT, selectedMonth, currentYear);

  useEffect(() => {
  }, [currentActivity]);
  
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        setChartKey(prev => prev + 1);
      }, 350);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return <LoadingState chartRef={chartRef} />;
  }

  if (error || !data) {
    return (
      <EmptyState
        chartRef={chartRef}
        selectedPT={selectedPT}
        selectedMonth={selectedMonth}
        currentYear={currentYear}
        onMonthChange={setSelectedMonth}
      />
    );
  }

  const currentData = getCurrentActivityData(data, currentActivity);
  const series = [currentData.percentage];
  
  const options: ApexOptions = {
    colors: ["#F87171"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val.toFixed(2) + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#60A5FA"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out h-full flex flex-col">
      <div className="flex-1 flex flex-col px-5 pt-5 bg-white shadow-default rounded-t-2xl dark:bg-gray-900 sm:px-6 sm:pt-6 transition-all duration-300 ease-in-out">
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
        />
      </div>

      <MonthlyTargetStats currentData={currentData} />
    </div>
  );
}