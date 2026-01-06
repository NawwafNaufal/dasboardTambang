import express from "express"
import { createUnitController } from "../../controller/unit/createUnit";
import { getUnitController } from "../../controller/unit/getUnit";
import { updateUnitController } from "../../controller/unit/updateUnit";
import { deleteUnitController } from "../../controller/unit/deleteUnit";
import { validateUnit } from "../../middleware/unit/unit";

const routes = express.Router()

routes.post("/unit",validateUnit,createUnitController)
routes.get("/unit",getUnitController)
routes.patch("/unit/:id",validateUnit,updateUnitController)
routes.delete("/unit/:id",deleteUnitController)

export default routes