import express from "express"
import { createActivityController } from "../../controller/activity/createActivity"
import { getActivityController } from "../../controller/activity/getActivity"
import { deleteActivityController } from "../../controller/activity/deleteActivity"
import { updateActivityController } from "../../controller/activity/updateActivity"
import { validateActivity } from "../../middleware/activity/validateActivity"

const routes = express.Router()

routes.post("/activity",validateActivity,createActivityController)
routes.get("/activity",getActivityController)
routes.delete("/activity/:id",deleteActivityController)
routes.patch("/activity/:id",validateActivity,updateActivityController)

export default routes
