<<<<<<< HEAD
import { useOutletContext } from "react-router";
=======
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
<<<<<<< HEAD
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
=======
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
        </div>
      </div>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
