import { responseError } from "../../error/responseError";
import { typeUserService } from "../../interface/users/typeUsers";
import { updateUsers } from "../../model/users/users.model";

export const updateUsersService = async (payload : typeUserService) : Promise<number> => {
    const {username,password,id_company,id_role,id} = payload

        const result = await updateUsers({username,password,id_company,id_role,id})

        if(result === 0) {
            throw new responseError("Id tidak ditemukan", 400)
        }

        return result
}