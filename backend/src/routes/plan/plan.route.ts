import express from "express"
import { createPlanController } from "../../controller/plan/createPlan.controller"
import { getPlanController } from "../../controller/plan/getPlan.controller"
import { updatePlanController } from "../../controller/plan/updatePlan.controller"
import { deletePlanController } from "../../controller/plan/deletePlan.controller"
import { validatePlan } from "../../middleware/plan/validatePlan"

const routes = express.Router()

routes.post("/plan",validatePlan,createPlanController)
routes.get("/plan",getPlanController)
routes.patch("/plan/:id",updatePlanController)
routes.delete("/plan/:id",deletePlanController)

export default routes