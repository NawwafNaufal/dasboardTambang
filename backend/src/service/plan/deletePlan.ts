import { responseError } from "../../error/responseError";
import { deletePlan } from "../../model/plan/planDb";

export const deletePlanService = async (id : number) : Promise<number> => {
    const result = await deletePlan(id)

        if(result === 0){
            throw new responseError("Id tidak valid", 400)
        }
        return result
}