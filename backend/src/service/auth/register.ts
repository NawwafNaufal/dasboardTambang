import { registerUser } from "../../model/auth/register";
import { registerType } from "../../interface/auth";
import { responseError } from "../../error/responseError";
import { logger } from "../../log/winston";

export const registerService = async (payload : registerType ): Promise<number> => {
    try {

        const createUser = await registerUser(payload)

        logger.info(`User register ${payload.username}`)

        return createUser
    
    } catch (error : any) {
        logger.warn(`Register failed ${error.code}`)
<<<<<<< HEAD

=======
        
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
        if (error.code === "ER_DUP_ENTRY") {
                throw new responseError("Username id already axist", 400)
        }
        throw error
    }
}