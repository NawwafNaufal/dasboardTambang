import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo, useState } from "react";

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
const months: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const generateMonthlyMetrics = (month: Month) => {
  const seed = months.indexOf(month) + 1;
  return [
    { label: "Lbg/Jam", value: parseFloat((6 + seed * 0.3).toFixed(2)),       max: 15,  min: parseFloat((4 + seed * 0.1).toFixed(2)),    avg: parseFloat((5 + seed * 0.2).toFixed(2))   },
    { label: "Mtr/Jam", value: parseFloat((38 + seed * 0.8).toFixed(2)),      max: 60,  min: parseFloat((30 + seed * 0.5).toFixed(2)),   avg: parseFloat((35 + seed * 0.6).toFixed(2))  },
    { label: "Ltr/Mtr", value: parseFloat((0.75 + seed * 0.006).toFixed(3)),  max: 1.5, min: parseFloat((0.6 + seed * 0.004).toFixed(3)), avg: parseFloat((0.68 + seed * 0.005).toFixed(3)) },
  ];
};

export default function ProductivityIndexChart() {
  const [selectedMonth, setSelectedMonth] = useState<Month>("Jan");
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const metrics = useMemo(() => generateMonthlyMetrics(selectedMonth), [selectedMonth]);
  const series = metrics.map((m) => parseFloat(((m.value / m.max) * 100).toFixed(1)));

  const options: ApexOptions = useMemo(() => ({
    series,
    chart: {
      height: 320,
      type: "radialBar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: { margin: 5, size: "30%", background: "transparent" },
        dataLabels: {
          name: { show: false },
          value: { show: false },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "14px",
          formatter: (seriesName: string, opts: any) => {
            const idx = opts.seriesIndex;
            return `${seriesName}:  ${metrics[idx].value}`;
          },
        } as any,
      },
    },
    colors: ["#27B5F5", "#1DA1F2", "#0E8AD9"],
    labels: metrics.map((m) => m.label),
    responsive: [{ breakpoint: 480, options: { legend: { show: false } } }],
  }), [selectedMonth]);

  return (
    // h-full agar tinggi mengikuti sibling SyncKpiChart
    <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 dark:bg-gray-900 dark:border-gray-800 flex flex-col">

      {/* Header + month picker */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
            Produktivity Index
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white mt-0.5">
            Total Bulanan
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {selectedMonth}
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showMonthPicker && (
            <div className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 grid grid-cols-3 gap-1 w-44">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedMonth(m); setShowMonthPicker(false); }}
                  className={`text-xs px-2 py-1.5 rounded-lg font-medium transition-all ${
                    selectedMonth === m
                      ? "bg-brand-500 text-white"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart — flex-1 agar mengisi sisa ruang */}
      <div className="flex-1 flex items-center justify-center">
        <Chart options={options} series={series} type="radialBar" height={320} width="100%" />
      </div>

      {/* Min / Avg / Max */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{m.label}</p>
              <p className="text-[10px] text-gray-400">Average</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{m.avg}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}