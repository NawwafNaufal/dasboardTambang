import  express  from "express";
import { createRoleController } from "../../controller/role/createRole.controller";
import { getRoleController } from "../../controller/role/getRole.controller";
import { updateRoleController } from "../../controller/role/updateRole.controller";
import { deleteRoleController } from "../../controller/role/deleteRole.controller";
import { validationnRole } from "../../middleware/role/validationRole";
import { isDeletableController } from "../../controller/role/getRole.controller";

const routes = express.Router()

routes.post("/role",validationnRole,createRoleController)
routes.get("/role",getRoleController)
routes.patch("/role/:id",validationnRole,updateRoleController)
routes.delete("/role/:id",deleteRoleController)
routes.get("/role/:id_unit",isDeletableController)

export default routes