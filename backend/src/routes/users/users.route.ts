import express from "express";
import { getUsersController } from "../../controller/users/getUsers.controller";
import { updateUsersController } from "../../controller/users/updateUsers.controller";
import { deleteUsersController } from "../../controller/users/deleteUsers.controller";
import { validationRegister } from "../../middleware/auth/validationRegister"

const routes = express.Router()

routes.get("/users",getUsersController)
routes.patch("/users/:id",validationRegister,updateUsersController)
routes.delete("/users/:id",deleteUsersController)

export default routes