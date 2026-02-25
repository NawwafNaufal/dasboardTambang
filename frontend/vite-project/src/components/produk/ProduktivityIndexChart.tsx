import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";

const metrics = [
  { label: "lbg/jam", value: 7.20,  max: 15  },
  { label: "mtr/jam", value: 42.95, max: 60  },
  { label: "ltr/mtr", value: 0.816, max: 1.5 },
];

const series = metrics.map((m) =>
  parseFloat(((m.value / m.max) * 100).toFixed(1))
);

export default function ProductivityIndexChart() {
  const options: ApexOptions = useMemo(() => ({
    series,
    chart: {
      height: 390,
      type: "radialBar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: { show: false },
          value: { show: false },
        },
        // ✅ barLabels persis template — label di samping bar
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "15px",
          formatter: (seriesName: string, opts: any) => {
            const idx = opts.seriesIndex;
            return `${seriesName}:  ${metrics[idx].value}`;
          },
        } as any,
      },
    },
    colors: ["#1ab7ea", "#0084ff", "#39539E"],
    labels: metrics.map((m) => m.label),
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { show: false },
        },
      },
    ],
  }), []);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 dark:bg-gray-900 dark:border-gray-800">
      <div className="mb-2 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
          Produktivity Index
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white mt-0.5">
          Total Bulanan
        </p>
      </div>

      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={390}
        width="100%"
      />
    </div>
  );
}