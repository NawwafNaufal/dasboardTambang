import { useOutletContext } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import DailyKpiChart from "@/components/produk/DailyKpiChart";
import SyncKpiChart from "@/components/produk/SigleChart";
import ProductivityIndexChart from "@/components/produk/ProduktivityIndexChart";
import DailyProduct from "@/components/produk/DailyProduct";
import ProductionStackedBar from "@/components/produk/ProductionStackChart";
import FbgMtrChart from "@/components/produk/FbgMrtChart";

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

        {/* Baris 2: SyncKpiChart kiri + ProductivityIndexChart kanan */}
        <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6 items-stretch">
          <div className="col-span-12 xl:col-span-8 flex flex-col">
            <SyncKpiChart />
          </div>
          <div className="col-span-12 xl:col-span-4 flex flex-col">
            <ProductivityIndexChart />
          </div>
        </div>

        {/* Baris 3: ProductionStackedBar kiri + FbgMtrChart kanan — sama tinggi */}
        <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6 items-stretch">
          <div className="col-span-12 xl:col-span-6 flex flex-col">
            <ProductionStackedBar selectedPT={selectedPT} />
          </div>
          <div className="col-span-12 xl:col-span-6 flex flex-col">
            <FbgMtrChart selectedPT={selectedPT} />
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