import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getPerformanceMessage } from "../../utils/monthlyTargetUtils";
import type { CurrentData } from "../../interface/monthlyTarget";

interface MonthlyTargetChartProps {
  options: ApexOptions;
  series: number[];
  currentData: CurrentData;
  selectedPT: string;
  currentActivity?: string;
  chartKey: number;
}

export default function MonthlyTargetChart({
  options,
  series,
  currentData,
  selectedPT,
  currentActivity,
  chartKey
}: MonthlyTargetChartProps) {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="relative transition-all duration-300 ease-in-out">
        <div className="max-h-[330px]" id="chartDarkStyle">
          {/* @ts-ignore */}
          <Chart
            key={`${selectedPT}-${currentActivity}-${chartKey}`}
            options={options}
            series={series}
            type="radialBar"
            height={330}
          />
        </div>

        <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ease-in-out ${
          currentData.deviation >= 0 
            ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' 
            : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
        }`}>
          {currentData.deviation >= 0 ? '+' : ''}{currentData.deviation.toFixed(2)}%
        </span>
      </div>

      <div className="py-6">
        <p className="mx-auto w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base transition-all duration-300 ease-in-out">
          {getPerformanceMessage(currentData)}
        </p>
      </div>
    </div>
  );
}