import { responseError } from "../../error/responseError";
import { productivityTypeService } from "../../interface/productivity/productivityType";
import { updateProductivity } from "../../model/produktivity/produktivity.model";

export const updateProductivityService = async (payload : productivityTypeService) : Promise<void> => {

    const {actual_value,value_input,date,id_plan,id_unit,id} = payload

    const result = await updateProductivity({actual_value,value_input,date,id_plan,id_unit,id}) 
    
        if(result === 0){
            throw new responseError("Id salah", 400)
        }
}