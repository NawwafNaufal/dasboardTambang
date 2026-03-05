import express from "express"
import { getPlanRkpa} from "../../controller/productivity/planRkpa"

const routes = express.Router()

routes.get("/plan-rkpa", getPlanRkpa)

export default routes