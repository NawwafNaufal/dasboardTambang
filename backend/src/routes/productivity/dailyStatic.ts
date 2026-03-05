import express from "express"
import { getStatisticsByMonth } from "../../controller/productivity/statistics"

const routes = express.Router()

routes.get("/static", getStatisticsByMonth)

export default routes