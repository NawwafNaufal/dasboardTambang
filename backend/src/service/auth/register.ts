import { registerUser } from "../../model/auth/register";
import { registerType } from "../../interface/auth";
import { responseError } from "../../error/responseError";

export const registerService = async (payload : registerType ): Promise<number> => {
    try {
        
        const createUser = await registerUser(payload)

        return createUser
    } catch (error : any) {
        if (error.code === "ER_DUP_ENTRY") {
                throw new responseError("Username id already axist", 400)
        }
        throw error
    }
}