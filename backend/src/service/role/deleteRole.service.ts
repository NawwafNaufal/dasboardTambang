import { deleteRole } from "../../model/role/role.model";
import { responseError } from "../../error/responseError";

export const deleteRoleService = async (id : number) : Promise<number> => {
    const result = await deleteRole(id)

        if(result === 0){
            throw new responseError("Id tidak valid", 400)
        }
        return result
} 