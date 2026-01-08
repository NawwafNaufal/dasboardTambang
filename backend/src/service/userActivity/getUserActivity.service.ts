import { responseError } from "../../error/responseError";
import { getUserActivity } from "../../model/userActivity/userActivity.model";
import { typeUserActivity } from "../../interface/userActivity/typeUserActivity";

export const getUserActivityService = async () : Promise<typeUserActivity[]> => {
    const result = await getUserActivity()

        if(!result) {
            throw new responseError("Data userActivity tidak ada", 400)
        }

        return result 
}