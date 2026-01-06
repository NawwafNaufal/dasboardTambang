import { deleteUnit } from "../../model/unit/unit";
import { responseError } from "../../error/responseError";

export const deleteUnitService = async (id: number) : Promise<number> => {
    const result = await deleteUnit(id)
        
        if(result === 0){
            throw new responseError("Id tidak ditemukan", 400)
        }

        return result
}