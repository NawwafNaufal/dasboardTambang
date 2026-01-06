import { responseError } from "../../error/responseError";
import { planType } from "../../interface/plan/planType";
import { getPlan } from "../../model/plan/planDb";

export const getPlanService = async () : Promise<planType[]> => {
    const getDataPlan = await getPlan()

    if(!getDataPlan) {
        throw new responseError("Data plan tidak ada",400)
    }
    return getDataPlan
}