import { updateRole } from "../../model/role/role";
import { roleTypePatch } from "../../interface/role/typeRole";
import { responseError } from "../../error/responseError";

export const updateRoleService = async (payload : roleTypePatch) : Promise<void> => {
    await updateRole(payload.role_name,payload.id) 
}

