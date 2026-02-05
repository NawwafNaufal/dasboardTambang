import express from "express"
import { getStatisticsByMonth } from "../../service/productivity/dailyStatic"

const routes = express.Router()

routes.get("/static", getStatisticsByMonth)

export default routes