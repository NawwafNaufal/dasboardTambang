import { getRole } from "../../model/role/role.model";
import { roleType } from "../../interface/role/typeRole";
import { responseError } from "../../error/responseError";
import { isDeletable } from "../../model/role/role.model";

export const getRoleService = async () : Promise<roleType[]> => {
    const getDataRole = await getRole()

    if(!getDataRole) {
        throw new responseError("Data role tidak ada", 400)
    }
    return getDataRole
}

export const isDeletableService = async (id_role : number) : Promise<boolean> => {
    const result = await isDeletable(id_role)

        return result
}