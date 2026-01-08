import express from "express"
import { createUnitController } from "../../controller/unit/createUnit.controller";
import { getUnitController } from "../../controller/unit/getUnit.controller";
import { updateUnitController } from "../../controller/unit/updateUnit.controller";
import { deleteUnitController } from "../../controller/unit/deleteUnit.controller";
import { validateUnit } from "../../middleware/unit/unit";
import { isDeletableController } from "../../controller/unit/getUnit.controller";

const routes = express.Router()

routes.post("/unit/:id_activity",validateUnit,createUnitController)
routes.get("/unit",getUnitController)
routes.patch("/unit/:id/:id_activity",validateUnit,updateUnitController)
routes.delete("/unit/:id",deleteUnitController)
routes.get("/unit/:id_activity",isDeletableController)

export default routes