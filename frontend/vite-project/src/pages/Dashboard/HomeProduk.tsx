import { useState } from "react";
import { useOutletContext } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import DailyKpiChart from "@/components/produk/DailyKpiChart";
import SyncKpiChart from "@/components/produk/SigleChart";
import ProductivityIndexChart from "@/components/produk/ProduktivityIndexChart";
import DailyProduct from "@/components/produk/DailyProduct";
import HeroBanner from "@/components/produk/HeroBanner";

export default function HomeProduk() {
  const { selectedPT, currentActivity } = useOutletContext<{
    selectedPT: string;
    currentActivity: string;
  }>();

  const [activeTab, setActiveTab] = useState("Volume");

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="Dashboard page"
      />
      <div className="flex flex-col gap-4 md:gap-6">

        {/* Baris 1: HeroBanner + ProductivityIndexChart overlap */}
        <div className="relative">
          <HeroBanner onTabChange={setActiveTab} />

          {/* Desktop: overlap — hanya tampil di Unit */}
          {activeTab === "Unit" && (
            <div
              className="hidden xl:block absolute bottom-0 left-4 z-10"
              style={{ width: "30%", transform: "translateY(86%)" }}
            >
              <ProductivityIndexChart />
            </div>
          )}

          {/* Mobile: normal flow — hanya tampil di Unit */}
          {activeTab === "Unit" && (
            <div className="xl:hidden mt-4">
              <ProductivityIndexChart />
            </div>
          )}
        </div>

        {/* Tab Volume — placeholder, belum dibuat */}
        {activeTab === "Volume" && (
          <div className="pl-4 pr-4">
            {/* konten volume akan dibuat nanti */}
          </div>
        )}

        {/* Tab Unit — semua chart masuk sini */}
        {activeTab === "Unit" && (
          <>
            {/* SyncKpiChart */}
            <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch" style={{ transform: "translateX(-16px)" }}>
              <div className="hidden xl:block xl:col-span-4" />
              <div className="col-span-12 xl:col-span-8">
                <SyncKpiChart />
              </div>
            </div>

            {/* DailyProduct */}
            <div className="pl-4 pr-4">
              <DailyProduct />
            </div>

            {/* DailyKpiChart */}
            <div className="pl-4 pr-4">
              <DailyKpiChart selectedPT={selectedPT} />
            </div>
          </>
        )}

      </div>
    </>
  );
}