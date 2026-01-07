import { responseError } from "../../error/responseError";
import { planTypeService } from "../../interface/plan/planType";
import { updatePlan } from "../../model/plan/plan.model";

export const updatePlanService = async (payload : planTypeService) : Promise<void> => {
    const {plan,rkap,date,id} = payload

    const result = await updatePlan(plan,rkap,date,id) 
    
        if(result === 0){
            throw new responseError("Id salah", 400)
        }
}