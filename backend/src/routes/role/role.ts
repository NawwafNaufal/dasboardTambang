import  express  from "express";
import { createRoleController } from "../../controller/role/createRole";
import { getRoleController } from "../../controller/role/getRole";
import { updateRoleController } from "../../controller/role/updateRole";
import { deleteRoleController } from "../../controller/role/deleteRole";
import { validationnRole } from "../../middleware/role/validationRole";

const routes = express.Router()

routes.post("/role",validationnRole,createRoleController)
routes.get("/role",getRoleController)
routes.patch("/role/:id",validationnRole,updateRoleController)
routes.delete("/role/:id",deleteRoleController)

export default routes