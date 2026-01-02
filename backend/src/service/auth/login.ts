import {findByUsername} from "../../model/auth/login";
import { loginType } from "../../interface/auth/login";
import { responseError } from "../../error/responseError";
import bcrypt from "bcrypt"

export const loginService = async (payload : loginType) => {

    const {username,password} = payload

    const users = await findByUsername(username)

    if(!users) {
        throw new responseError("Pengguna tidak di temukan",400)
    }
    const comparePassword = await bcrypt.compare(password,users.password)

    if(!comparePassword) {
        throw new responseError("Password salah",400)
    }

    return {
        username : users.username,
        id_role : users.id_role,
        id_company : users.id_company
    }   
}