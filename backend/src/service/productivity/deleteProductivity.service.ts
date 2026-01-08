import { responseError } from "../../error/responseError";
import { deleteProduktivity } from "../../model/produktivity/produktivity.model";

export const deleteProductivityService = async (id : number) : Promise<number> => {
    const result = await deleteProduktivity(id)

        if(result === 0){
            throw new responseError("Id tidak valid", 400)
        }
        return result
}