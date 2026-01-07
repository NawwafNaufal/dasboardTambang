import express from "express"
import { createProductivityController } from "../../controller/productivity/createProductivity.controller"
import { getProductivityController } from "../../controller/productivity/getProductivity.controller"
import { updateProductivityController } from "../../controller/productivity/updateProductivity.controller"
import { deleteProductivityController } from "../../controller/productivity/deleteProductivity.controller"
import { validateProductivity } from "../../middleware/productivity/validateProductivity"

const routes = express.Router()

routes.post("/productivity",validateProductivity, createProductivityController)
routes.get("/productivity", getProductivityController)
routes.patch("/productivity/:id",validateProductivity, updateProductivityController)
routes.delete("/productivity/:id", deleteProductivityController)

export default routes