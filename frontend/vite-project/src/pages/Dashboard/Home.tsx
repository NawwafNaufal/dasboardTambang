import { useOutletContext } from "react-router"; // ✅ GANTI INI - pakai "react-router" bukan "react-router-dom"

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const { selectedPT } = useOutletContext<{ selectedPT: string }>();

  console.log("🟡 Home terima selectedPT:", selectedPT);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="Dashboard page"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics selectedPT={selectedPT} />
          <MonthlySalesChart selectedPT={selectedPT} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget selectedPT={selectedPT} />
        </div>

        <div className="col-span-12">
          <StatisticsChart selectedPT={selectedPT} />
        </div>
      </div>
    </>
  );
}