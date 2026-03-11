import { useState } from "react";
import { useOutletContext } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import DailyKpiChart from "@/components/produk/DailyKpiChart";
import SyncKpiChart from "@/components/produk/SigleChart";
import ProductivityIndexChart from "@/components/produk/ProduktivityIndexChart";
import DailyProduct from "@/components/produk/DailyProduct";
import HeroBanner from "@/components/produk/HeroBanner";

export default function HomeProduk() {
  const { selectedPT, currentActivity, activeTab, setActiveTab } = useOutletContext<{
    selectedPT: string;
    currentActivity: string;
    activeTab: string;           // ← TAMBAH
    setActiveTab: (tab: string) => void; // ← TAMBAH
  }>();

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="Dashboard page"
      />
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="relative">
          <HeroBanner onTabChange={setActiveTab} /> {/* ← pakai setActiveTab dari context */}
          {activeTab === "Unit" && (
            <div className="hidden xl:block absolute bottom-0 left-4 z-10"
              style={{ width: "30%", transform: "translateY(86%)" }}>
                
              <ProductivityIndexChart />
            </div>
          )}
          {activeTab === "Unit" && (
            <div className="xl:hidden mt-4">
              <ProductivityIndexChart />
            </div>
          )}
        </div>

        {activeTab === "Volume" && (
          <div className="pl-4 pr-4">
          </div>
        )}

        {activeTab === "Unit" && (
          <>
            <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch" style={{ transform: "translateX(-16px)" }}>
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