import express from "express"
import { createActivityController } from "../../controller/activity/createActivity.controller"
import { getActivityController } from "../../controller/activity/getActivity.controller"
import { deleteActivityController } from "../../controller/activity/deleteActivity.controller"
import { updateActivityController } from "../../controller/activity/updateActivity.controller"
import { validateActivity } from "../../middleware/activity/validateActivity"

const routes = express.Router()

routes.post("/activity",validateActivity,createActivityController)
routes.get("/activity",getActivityController)
routes.delete("/activity/:id",deleteActivityController)
routes.patch("/activity/:id",validateActivity,updateActivityController)

export default routes
