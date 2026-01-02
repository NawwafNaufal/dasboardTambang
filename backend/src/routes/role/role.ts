import  express  from "express";
import { createRoleController } from "../../controller/role/createRole";
import { getRoleController } from "../../controller/role/getRole";
import { updateRoleController } from "../../controller/role/updateRole";

const route = express.Router()

route.post("/role",createRoleController)
route.get("/role",getRoleController)
route.patch("/role/:id",updateRoleController)

export default route