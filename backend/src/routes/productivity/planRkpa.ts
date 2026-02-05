import express from "express"
import { getPlanRkpaByYear } from "../../service/productivity/planRkpaProductivity"

const routes = express.Router()

routes.get("/plan-rkpa", getPlanRkpaByYear)

export default routes