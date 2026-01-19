import { responseError } from "../../error/responseError";
import { activityTypeService } from "../../interface/activity/activity";
import { updateActivity } from "../../model/activity/activity.model";

export const updateActivityService = async (payload : activityTypeService) : Promise<void> => {
    const result = await updateActivity(payload.activity_name,payload.id) 
    
        if(result === 0){
            throw new responseError("Id salah", 400)
        }
}