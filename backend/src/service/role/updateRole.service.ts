import { updateRole } from "../../model/role/role.model";
import { roleTypePatch } from "../../interface/role/typeRole";
import { responseError } from "../../error/responseError";

export const updateRoleService = async (payload : roleTypePatch) : Promise<void> => {
    const result = await updateRole(payload.role_name,payload.id) 
    
        if(result === 0){
            throw new responseError("Id tidak salah", 400)
        }
}

