import { responseError } from "../../error/responseError";
import { typeUserActivityPatch } from "../../interface/userActivity/typeUserActivity";
import { updateUserActivity } from "../../model/userActivity/userActivity.model";

export const updateUserActivityService = async (payload : typeUserActivityPatch) : Promise<number> => {
    const {id_user,id_activity,id} =  payload

        const result = await updateUserActivity({id_user,id_activity,id})

        if(result === 0) {
            throw new responseError("Id tidak ditemukan", 400)
        }

        return result
}