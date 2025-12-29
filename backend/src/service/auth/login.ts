import {findByUsername} from "../../model/auth/login";
import { loginType } from "../../interface/auth/login";

export const loginService = async ({username,password} : loginType) => {

    const users = await findByUsername(username)

    if(!users){
        throw new Error("Username not found")
    }

    if(users.password !== password){
        throw new Error("Wrong Password")
    }

    return {
        id : users.id,
        username : users.username
    }
}