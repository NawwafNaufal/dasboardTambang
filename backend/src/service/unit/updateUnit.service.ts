import { updateUnit } from "../../model/unit/unit.model";
import { unitTypeService } from "../../interface/unit/typeUnit";
import { responseError } from "../../error/responseError";

export const updateUnitService = async (payload : unitTypeService) : Promise<number> => {
    const {unit_name,id_activity,id} = payload
        const result = await updateUnit({unit_name,id_activity,id})

        if(result === 0) {
            throw new responseError("Id tidak ditemukan", 400)
        }

        return result
}