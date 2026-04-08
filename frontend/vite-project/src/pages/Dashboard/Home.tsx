import { useOutletContext } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import DailyKpiChart from "@/components/produk/DailyKpiChart";
import SyncKpiChart from "@/components/produk/SigleChart";
import ProductivityIndexChart from "@/components/produk/ProduktivityIndexChart";
import DailyProduct from "@/components/produk/DailyProduct";
import HeroBanner from "@/components/produk/HeroBanner";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";

export default function HomeProduk() {
  const { selectedPT, currentActivity, activeTab, setActiveTab } =
    useOutletContext<{
      selectedPT: string;
      currentActivity: string;
      activeTab: string;
      setActiveTab: (tab: string) => void;
    }>();

  return (
    <>
      <PageMeta title="Dashboard Produk" description="Dashboard page" />
      <div className="flex flex-col gap-4 md:gap-6">

        {/* HERO */}
        <div className="relative">
          <HeroBanner activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* WRAPPER SPACING */}
        <div className="px-2 md:px-3 xl:px-4 w-full mt-0">

          {/* ===================== VOLUME ===================== */}
          {activeTab === "Volume" && (
            <>
              <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch w-full mt-0">
                {/* LEFT - MonthlyTarget */}
                <div className="col-span-12 xl:col-span-4 relative z-10 xl:-mt-[99.5px] flex w-full">
                  <MonthlyTarget
                    selectedPT={selectedPT}
                    currentActivity={currentActivity}
                  />
                </div>

                {/* RIGHT - Metrics + Chart */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 md:gap-6 w-full">
                  <EcommerceMetrics
                    selectedPT={selectedPT}
                    currentActivity={currentActivity}
                  />
                  <MonthlySalesChart
                    selectedPT={selectedPT}
                    currentActivity={currentActivity}
                  />
                </div>
              </div>

              {/* STATISTICS */}
              <div className="w-full mt-2 md:mt-8">
                <StatisticsChart selectedPT={selectedPT} />
              </div>
            </>
          )}

          {/* ===================== INDEX ===================== */}
          {activeTab === "Index" && (
            <>
              <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch w-full mt-0">
                {/* LEFT */}
                <div className="col-span-12 xl:col-span-4 relative z-10 xl:-mt-[99.5px] flex w-full">
                  <ProductivityIndexChart />
                </div>

                {/* RIGHT */}
                <div className="col-span-12 xl:col-span-8 w-full">
                  <SyncKpiChart />
                </div>
              </div>

              <div className="px-2 md:px-0 mt-2 md:mt-4">
                <DailyProduct />
              </div>

              <div className="px-2 md:px-0 mt-2 md:mt-4">
                <DailyKpiChart selectedPT={selectedPT} />
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}