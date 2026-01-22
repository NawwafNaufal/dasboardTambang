import express from "express"
import { createProductivityController } from "../../controller/productivity/createProductivity.controller"
// import { getProductivityController } from "../../controller/productivity/getProductivity.controller"
import { updateProductivityController } from "../../controller/productivity/updateProductivity.controller"
import { deleteProductivityController } from "../../controller/productivity/deleteProductivity.controller"
import { validateProductivity } from "../../middleware/productivity/validateProductivity"
// import { getProduktivityByMonthController } from "../../controller/productivity/getProductivity.controller"
import { getChartByYearController } from "../../controller/productivity/getProductivity.controller"
import { getDataGoogleController } from "../../controller/productivity/getDataS"
// routes/monthlyPlan.route.ts
// import { saveMonthlyPlan } from "../../controller/productivity/monthlyPlanS";
import { getMonthlyActualBySite } from "../../service/productivity/dailyReport"

const routes = express.Router()

// routes.post("/monthly-plan",saveMonthlyPlan);
// routes.post("/productivity",validateProductivity, createProductivityController)
// routes.get("/productivity", getProductivityController)
routes.patch("/productivity/:id",validateProductivity, updateProductivityController)
routes.delete("/productivity/:id", deleteProductivityController)
routes.get("/productivity", getDataGoogleController)
routes.get("/productivity-chart", getChartByYearController)
routes.get("/monthly-actual/by-site", getMonthlyActualBySite);

export default routes