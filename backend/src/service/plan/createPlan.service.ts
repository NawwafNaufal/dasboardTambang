import { createPlan } from "../../model/plan/plan.model";
import { planType } from "../../interface/plan/planType";

export const createPlanService = async (payload : planType) : Promise<number> => {
    const result = await createPlan(payload)
        return result
}