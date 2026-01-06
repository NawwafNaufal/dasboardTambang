import { getUnit } from "../../model/unit/unit";
import { unitType } from "../../interface/unit/typeUnit";
import { responseError } from "../../error/responseError";

export const getUnitService = async () : Promise<unitType[]> => {
    const result = await getUnit()

        if(!result) {
            throw new responseError("Data unit tidak ada", 400)
        }

        return result 
}