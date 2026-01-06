import express from "express"
import { createProductivityController } from "../../controller/productivity/createProductivity"
import { getProductivityController } from "../../controller/productivity/getProductivity"
import { updateProductivityController } from "../../controller/productivity/updateProductivity"
import { deleteProductivityController } from "../../controller/productivity/deleteProductivity"
import { validateProductivity } from "../../middleware/productivity/validateProductivity"

const routes = express.Router()

routes.post("/productivity",validateProductivity, createProductivityController)
routes.get("/productivity", getProductivityController)
routes.patch("/productivity/:id",validateProductivity, updateProductivityController)
routes.delete("/productivity/:id", deleteProductivityController)

export default routes