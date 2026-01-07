import { createUnit } from "../../model/unit/unit.model";
import { unitType } from "../../interface/unit/typeUnit";

export const createUnitService = async (payload : unitType) : Promise<number> => {
    const {unit_name,id_activity} = payload

        const result = await createUnit({unit_name,id_activity})
            return result
}