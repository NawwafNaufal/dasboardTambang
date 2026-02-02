import { responseError } from "../../error/responseError";
import { deleteUsers } from "../../model/users/users.model";

export const deleteUsersService = async (id: number) : Promise<number> => {
    const result = await deleteUsers(id)
        
        if(result === 0){
            throw new responseError("Id tidak ditemukan", 400)
        }

        return result
}