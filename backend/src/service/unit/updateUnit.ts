import { updateUnit } from "../../model/unit/unit";
import { unitTypeService } from "../../interface/unit/typeUnit";
import { responseError } from "../../error/responseError";

export const updateUnitService = async (payload : unitTypeService) : Promise<number> => {
    const result = await updateUnit(payload.unit_name,payload.id)

        if(result === 0) {
            throw new responseError("Id tidak ditemukan", 400)
        }

        return result
}