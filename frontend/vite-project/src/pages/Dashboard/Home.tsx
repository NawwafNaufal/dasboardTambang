import { useOutletContext } from "react-router";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  // ✅ Terima currentActivity dari outlet context
  const { selectedPT, currentActivity } = useOutletContext<{ 
    selectedPT: string;
    currentActivity: string;
  }>();

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* ✅ Pass currentActivity ke EcommerceMetrics */}
          <EcommerceMetrics 
            selectedPT={selectedPT} 
            currentActivity={currentActivity}
          />
          {/* ✅ Pass currentActivity ke MonthlySalesChart */}
          <MonthlySalesChart 
            selectedPT={selectedPT} 
            currentActivity={currentActivity}
          />
        </div>
        <div className="col-span-12 xl:col-span-5">
          {/* ✅ Pass currentActivity ke MonthlyTarget */}
          <MonthlyTarget 
            selectedPT={selectedPT}
            currentActivity={currentActivity}
          />
        </div>
        <div className="col-span-12">
          <StatisticsChart selectedPT={selectedPT} />
        </div>
      </div>
    </>
  );
}
