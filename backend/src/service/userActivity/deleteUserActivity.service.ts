import { responseError } from "../../error/responseError";
import { deleteUserActivity } from "../../model/userActivity/userActivity.model";

export const deleteUserActivityService = async (id: number) : Promise<number> => {
    const result = await deleteUserActivity(id)
        
        // if(result === 0){
        //     throw new responseError("Id tidak ditemukan", 400)
        // }

        return result
}