import { useOutletContext } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import FearGreedGaugePaOne from "@/components/produk/FearGreadPaOne";
import FearGreedGaugePaTwo from "@/components/produk/FearGreadPaTwo";
import FearGreedGaugePaThree from "@/components/produk/FearGreadPaThree";
import DailyKpiChart from "@/components/produk/DailyKpiChart";
import SyncKpiChart from "@/components/produk/SigleChart";
import ProductivityIndexChart from "@/components/produk/ProduktivityIndexChart";
import DailyProduct from "@/components/produk/DailyProduct";

export default function HomeProduk() {
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

        {/* Baris 1: DailyProduct full width */}
        <div className="col-span-12">
          <DailyProduct />
        </div>

        {/* Baris 2-3: kiri (9 col) = gauge kecil + SyncKpi | kanan (3 col) = ProductivityIndex panjang */}
        <div className="col-span-12 xl:col-span-8 grid grid-cols-3 gap-3">
          {/* Gauge kecil */}
          <div className="col-span-1 h-36">
            <FearGreedGaugePaOne />
          </div>
          <div className="col-span-1 h-36">
            <FearGreedGaugePaTwo />
          </div>
          <div className="col-span-1 h-36">
            <FearGreedGaugePaThree />
          </div>
          {/* SyncKpiChart di bawah gauge, span full 3 col, dengan jarak atas */}
          <div className="col-span-3 mt-3">
            <SyncKpiChart />
          </div>
        </div>

        {/* Kanan: ProductivityIndexChart satu, tinggi penuh */}
        <div className="col-span-12 xl:col-span-4 flex flex-col">
          <div className="flex-1 flex flex-col">
            <ProductivityIndexChart />
          </div>
        </div>

        {/* Baris 4: DailyKpiChart full width */}
        <div className="col-span-12">
          <DailyKpiChart selectedPT={selectedPT} />
        </div>

      </div>
    </>
  );
}