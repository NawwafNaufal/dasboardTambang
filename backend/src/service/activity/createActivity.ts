import { activityType } from "../../interface/activity/activity"
import { createActivity } from "../../model/activity/activity"

export const createActivityService = async (payload : activityType) : Promise<number> => {
    const role = await createActivity(payload.activity_name)

    return role
}