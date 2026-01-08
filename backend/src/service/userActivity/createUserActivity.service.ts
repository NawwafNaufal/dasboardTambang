import { typeUserActivity } from "../../interface/userActivity/typeUserActivity"
import { createUserActivity } from "../../model/userActivity/userActivity.model"

export const createUserActivityService = async (payload : typeUserActivity) : Promise<number> => {
    const {id_user,id_activity} = payload
    const result = await createUserActivity({id_user,id_activity})
        return result
}