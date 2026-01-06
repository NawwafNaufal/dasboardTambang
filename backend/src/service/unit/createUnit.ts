import { createUnit } from "../../model/unit/unit";

export const createUnitService = async (unit_name : string) : Promise<number> => {
    const result = await createUnit(unit_name)
        return result
}