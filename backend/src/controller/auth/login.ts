import { Request,Response,NextFunction } from "express";
import { loginService } from "../../service/auth/login";
import { authType } from "../../interface/auth/login";

export const loginController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {

    try {
        const payload = req.body as authType;
        const result = await loginService(payload)

        req.session.user = {
            username : result.username,
            idRole : result.id_role,
            idCompany : result.id_company
        }

        res.status(200).json({
            message : "Login success",
            data : result
        })
    } catch (error : any) {
        next(error)
    }
}