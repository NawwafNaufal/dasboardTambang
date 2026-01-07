import { getUnit } from "../../model/unit/unit.model";
import { unitType } from "../../interface/unit/typeUnit";
import { responseError } from "../../error/responseError";
import { isDeletable } from "../../model/unit/unit.model";

export const getUnitService = async () : Promise<unitType[]> => {
    const result = await getUnit()

        if(!result) {
            throw new responseError("Data unit tidak ada", 400)
        }

        return result 
}

export const isDeletableService = async (id_activity : number) : Promise<boolean> => {
    const result = await isDeletable(id_activity)

        // if(!result) {
        //     throw new responseError("Data unit tidak ada", 400)
        // }

        return result
}