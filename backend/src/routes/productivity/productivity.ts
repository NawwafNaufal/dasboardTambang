import express from "express"
import { getMonthlyActualBySite } from "../../controller/productivity/dailyActual"

const routes = express.Router()

routes.get("/monthly-actual/by-site", getMonthlyActualBySite);

export default routes