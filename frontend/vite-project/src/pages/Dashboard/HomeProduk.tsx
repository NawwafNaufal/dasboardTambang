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

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="Dashboard page"
      />
      <div className="flex flex-col gap-4 md:gap-6">

        {/* Baris 1 + 2: HeroBanner dengan ProductivityIndexChart overlap kiri & SyncKpiChart kanan */}
        <div className="relative">
          {/* Hero Banner */}
          <HeroBanner />

          {/* ProductivityIndexChart — overlap banner, pojok kiri bawah */}
          <div
            className="absolute bottom-0 left-4 z-10"
            style={{ width: "30%", transform: "translateY(87%)" }}
          >
            <ProductivityIndexChart />
          </div>
        </div>

        {/* Baris 2: SyncKpiChart geser ke kanan dengan gap yang cukup */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch">
          {/* Spacer kosong selebar ProductivityIndexChart */}
          <div className="hidden xl:block xl:col-span-4" />

          {/* SyncKpiChart mengisi sisa 8 kolom dengan padding kiri sebagai gap */}
          <div className="col-span-12 xl:col-span-8 xl:pl-6 pr-4" style={{ marginLeft: "-50px",minHeight: "468px" }}>
            <SyncKpiChart />
          </div>
        </div>

        {/* Baris 3: DailyProduct full width */}
        <div className="col-span-12 pl-4 pr-4">
          <DailyProduct />
        </div>

        {/* Baris 4: DailyKpiChart full width */}
        <div className="col-span-12 pl-4 pr-4">
          <DailyKpiChart selectedPT={selectedPT} />
        </div>

      </div>
    </>
  );
}