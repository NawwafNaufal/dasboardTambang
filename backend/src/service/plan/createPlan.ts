import { createPlan } from "../../model/plan/planDb";
import { planType } from "../../interface/plan/planType";

export const createPlanService = async (payload : planType) : Promise<number> => {
    const result = await createPlan(payload)
        return result
}