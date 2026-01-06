import { getRole } from "../../model/role/role";
import { roleType } from "../../interface/role/typeRole";
import { responseError } from "../../error/responseError";

export const getRoleService = async () : Promise<roleType[]> => {
    const getDataRole = await getRole()

    if(!getDataRole) {
        throw new responseError("Data role tidak ada",400)
    }
    return getDataRole
}