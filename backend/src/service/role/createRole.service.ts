import {  createRole } from "../../model/role/role.model";
import { roleType } from "../../interface/role/typeRole";

export const createRoleService = async (payload : roleType) : Promise<number> => {
    const role = await createRole(payload.role_name)

    return role
}