import { responseError } from "../../error/responseError";
import { planType } from "../../interface/plan/planType";
import { getPlan } from "../../model/plan/plan.model";
import { isDeletable } from "../../model/plan/plan.model";

export const getPlanService = async () : Promise<planType[]> => {
    const getDataPlan = await getPlan()

    if(!getDataPlan) {
        throw new responseError("Data plan tidak ada",400)
    }
    return getDataPlan
}

export const isDeletableService = async (id_activity : number) : Promise<boolean> => {
    const result = await isDeletable(id_activity)

        return result
}