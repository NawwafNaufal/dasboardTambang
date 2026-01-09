import { responseError } from "../../error/responseError";
import { typeUsers } from "../../interface/users/typeUsers";
import { getUsers } from "../../model/users/users.model";

export const getUsersService = async () : Promise<typeUsers[]> => {
    const result = await getUsers()

        if(!result) {
            throw new responseError("Data users tidak ada", 400)
        }

        return result 
}