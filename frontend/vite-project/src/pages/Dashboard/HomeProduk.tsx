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
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="Dashboard page"
      />
      <div className="flex flex-col gap-4 md:gap-6">

        {/* HERO */}
        <HeroBanner activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ================= INDEX TAB ================= */}
        {activeTab === "Index" && (
          <div className="w-full">
            <ProductivityIndexChart />
          </div>
        )}

        {/* ================= VOLUME TAB ================= */}
        {activeTab === "Volume" && (
          <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {/* LEFT */}
              <div className="col-span-12 xl:col-span-4 min-w-0 overflow-hidden">
                <MonthlyTarget
                  selectedPT={selectedPT}
                  currentActivity={currentActivity}
                />
              </div>
              {/* RIGHT */}
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 md:gap-6 min-w-0">
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
            <div className="w-full min-w-0">
              <StatisticsChart selectedPT={selectedPT} />
            </div>
          </>
        )}

        {/* ================= UNIT TAB ================= */}
        {activeTab === "Unit" && (
          <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {/* LEFT kosong */}
              <div className="hidden xl:block xl:col-span-4 min-w-0" />
              {/* RIGHT */}
              <div className="col-span-12 xl:col-span-8 min-w-0 overflow-hidden">
                <SyncKpiChart />
              </div>
            </div>
            <div className="px-4 min-w-0">
              <DailyProduct />
            </div>
            <div className="px-4 min-w-0">
              <DailyKpiChart selectedPT={selectedPT} />
            </div>
          </>
        )}

      </div>
    </>
  );
}