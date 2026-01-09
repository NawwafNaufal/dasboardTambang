import express from "express"
import { createUserActivityController } from "../../controller/userActivity/createUserActivity.controller"
import { getUserActivityController } from "../../controller/userActivity/getUserActivity.controller"
import { updateUserActivityController } from "../../controller/userActivity/updateUserActivity.controller"
import { deleteUserActivityController } from "../../controller/userActivity/deleteUserActivity.controller"

const routes = express.Router()

routes.post("/user-activity",createUserActivityController)
routes.get("/user-activity",getUserActivityController)
routes.patch("/user-activity/:id",updateUserActivityController)
routes.delete("/user-activity/:id",deleteUserActivityController)

export default routes