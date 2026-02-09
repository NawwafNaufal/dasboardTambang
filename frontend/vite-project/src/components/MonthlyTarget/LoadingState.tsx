import { RefObject } from "react";

interface LoadingStateProps {
  chartRef: RefObject<HTMLDivElement>;
}

export default function LoadingState({ chartRef }: LoadingStateProps) {
  return (
    <div ref={chartRef} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ease-in-out">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading data...</p>
          </div>
        </div>
      </div>
    </div>
  );
}