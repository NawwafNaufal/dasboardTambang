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
  const { selectedPT, currentActivity, activeTab, setActiveTab } = useOutletContext<{
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

        {/* HeroBanner + overlay cards */}
        <div className="relative">
          <HeroBanner activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Unit: ProductivityIndexChart overlay */}
          {activeTab === "Index" && (
            <div
              className="hidden xl:block absolute bottom-0 left-4 z-10"
              style={{ width: "30%", transform: "translateY(86%)" }}
            >
              <div style={{ minHeight: 600 }}>
                <ProductivityIndexChart />
              </div>
            </div>
          )}
          {activeTab === "Index" && (
            <div className="xl:hidden mt-4">
              <ProductivityIndexChart />
            </div>
          )}

          {/* Volume: MonthlyTarget overlay — sama persis */}
          {activeTab === "Volume" && (
            <div
              className="hidden xl:block absolute bottom-0 left-4 z-10"
              style={{ width: "30%", transform: "translateY(86%)" }}
            >
              <div>
                <MonthlyTarget
                  selectedPT={selectedPT}
                  currentActivity={currentActivity}
                />
              </div>
            </div>
          )}
          {activeTab === "Volume" && (
            <div className="xl:hidden mt-4">
              <MonthlyTarget
                selectedPT={selectedPT}
                currentActivity={currentActivity}
              />
            </div>
          )}
        </div>

        {/* ── VOLUME TAB ── */}
        {activeTab === "Volume" && (
          <>
            <div
              className="grid grid-cols-12 gap-4 md:gap-6 items-stretch"
              style={{ transform: "translateX(-16px)" }}
            >
              <div className="hidden xl:block xl:col-span-4" />
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 md:gap-6">
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
            <div className="w-full">
              <StatisticsChart selectedPT={selectedPT} />
            </div>
          </>
        )}

        {/* ── UNIT TAB ── */}
        {activeTab === "Index" && (
          <>
            <div
              className="grid grid-cols-12 gap-4 md:gap-6 items-stretch"
              style={{ transform: "translateX(-16px)" }}
            >
              <div className="hidden xl:block xl:col-span-4" />
              <div className="col-span-12 xl:col-span-8">
                <SyncKpiChart />
              </div>
            </div>
            <div className="pl-4 pr-4">
              <DailyProduct />
            </div>
            <div className="pl-4 pr-4">
              <DailyKpiChart selectedPT={selectedPT} />
            </div>
          </>
        )}

      </div>
    </>
  );
}