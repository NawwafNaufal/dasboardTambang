import express from "express"
import { createPlanController } from "../../controller/plan/createPlan"
import { getPlanController } from "../../controller/plan/getPlan"
import { updatePlanController } from "../../controller/plan/updatePlan"
import { deletePlanController } from "../../controller/plan/deletePlan"
import { validatePlan } from "../../middleware/plan/validatePlan"

const routes = express.Router()

routes.post("/plan",validatePlan,createPlanController)
routes.get("/plan",getPlanController)
routes.patch("/plan/:id",updatePlanController)
routes.delete("/plan/:id",deletePlanController)

export default routes