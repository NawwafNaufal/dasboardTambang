import { responseError } from "../../error/responseError";
import { getActivity } from "../../model/activity/activity.model";
import { activityType } from "../../interface/activity/activity";

export const getActivityService = async () : Promise<activityType[]> => {
    const getDataActivity = await getActivity()

    if(!getDataActivity) {
        throw new responseError("Data company tidak ada",400)
    }
    return getDataActivity
}