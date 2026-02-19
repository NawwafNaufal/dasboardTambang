import { useOutletContext } from "react-router";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import BarMtrLbg from "@/components/produk/BarMtrLbg";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import FearGreedGaugePaOne from "@/components/produk/FearGreadPaOne";
import FearGreedGaugePaTwo from "@/components/produk/FearGreadPaTwo";
import FearGreedGaugePaThree from "@/components/produk/FearGreadPaThree";

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

        {/* Baris 1: EcommerceMetrics (7 col) | BarMtrLbg (5 col) */}
        <div className="col-span-12 xl:col-span-7">
          <EcommerceMetrics
            selectedPT={selectedPT}
            currentActivity={currentActivity}
          />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <BarMtrLbg
            // selectedPT={selectedPT}
            // currentActivity={currentActivity}
          />
        </div>

        {/* Baris 2: MonthlySalesChart full */}
        {/* <div className="col-span-12">
          <MonthlySalesChart
            selectedPT={selectedPT}
            currentActivity={currentActivity}
          />
        </div> */}

        {/* Baris 3: Ketiga gauge sejajar 3 kolom sama rata */}
        <div className="col-span-12 grid grid-cols-3 gap-3">
          <FearGreedGaugePaOne />
          <FearGreedGaugePaTwo />
          <FearGreedGaugePaThree />
        </div>

        {/* StatisticsChart full */}
        <div className="col-span-12">
          <StatisticsChart selectedPT={selectedPT} />
        </div>

      </div>
    </>
  );
}