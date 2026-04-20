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
import { useEffect, useRef, useState } from "react";

function useSlideUp(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, visible };
}

// Komponen wrapper animasi
function SlideUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useSlideUp(delay);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: visible ? "translateY(0)" : "translateY(40px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.5s ease, opacity 0.5s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

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
        <SlideUp delay={0}>
          <div className="relative">
            <HeroBanner activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </SlideUp>

        {/* WRAPPER SPACING */}
        <div className="px-2 md:px-3 xl:px-4 w-full mt-0">
          {activeTab === "Volume" && (
            <>
              <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch w-full mt-0">
                {/* LEFT - MonthlyTarget */}
                <SlideUp
                  delay={100}
                  className="col-span-12 xl:col-span-4 relative z-10 xl:-mt-[99.5px] flex w-full"
                >
                  <MonthlyTarget
                    selectedPT={selectedPT}
                    currentActivity={currentActivity}
                  />
                </SlideUp>

                {/* RIGHT - Metrics + Chart */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 md:gap-6 w-full">
                  <SlideUp delay={200}>
                    <EcommerceMetrics
                      selectedPT={selectedPT}
                      currentActivity={currentActivity}
                    />
                  </SlideUp>
                  <SlideUp delay={300}>
                    <MonthlySalesChart
                      selectedPT={selectedPT}
                      currentActivity={currentActivity}
                    />
                  </SlideUp>
                </div>
              </div>

              {/* STATISTICS */}
              <SlideUp delay={400} className="w-full mt-2 md:mt-8">
                <StatisticsChart selectedPT={selectedPT} />
              </SlideUp>
            </>
          )}

          {activeTab === "Index" && (
            <>
              <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch w-full mt-0">
                {/* LEFT */}
                <SlideUp
                  delay={100}
                  className="col-span-12 xl:col-span-4 relative z-10 xl:-mt-[99.5px] flex w-full"
                >
                  <ProductivityIndexChart />
                </SlideUp>

                {/* RIGHT */}
                <SlideUp delay={200} className="col-span-12 xl:col-span-8 w-full">
                  <SyncKpiChart />
                </SlideUp>
              </div>

              <SlideUp delay={300} className="px-2 md:px-0 mt-2 md:mt-4">
                <DailyProduct />
              </SlideUp>

              <SlideUp delay={400} className="px-2 md:px-0 mt-2 md:mt-4">
                <DailyKpiChart selectedPT={selectedPT} />
              </SlideUp>
            </>
          )}
        </div>
      </div>
    </>
  );
}