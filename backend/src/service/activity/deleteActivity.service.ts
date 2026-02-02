import { responseError } from "../../error/responseError";
import { deleteActivity } from "../../model/activity/activity.model";

export const deleteActivityService = async (id : number) : Promise<number> => {
    const result = await deleteActivity(id)

        if(result === 0){
            throw new responseError("Id tidak valid", 400)
        }
        return result
}