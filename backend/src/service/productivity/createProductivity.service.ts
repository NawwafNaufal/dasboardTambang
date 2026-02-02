import { productivityType } from "../../interface/productivity/productivityType"
import { createProductivity } from "../../model/produktivity/produktivity.model"

export const createProductivityService = async (payload : productivityType) : Promise<number> => {

    const {actual_value,value_input,date,id_plan,id_unit} = payload

        const role = await createProductivity({actual_value,value_input,date,id_plan,id_unit})

    return role
}