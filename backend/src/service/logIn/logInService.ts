import { responseError } from "../../error/responseError";
import { loginType } from "../../interface/logIn/logInType";
import { dataLogin } from "../../model/login.model";

export const loginService = async (data : loginType) => {
    const getDataUser = await dataLogin.findOne({username : data.username})

    if (!getDataUser) {
        throw new responseError("Username Salah",400)
    }

    if (data.password !== getDataUser.password) {
        throw new responseError("Password Salah",400)
    }

    return getDataUser
}