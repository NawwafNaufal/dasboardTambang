import { Request,Response,NextFunction } from "express";
import { loginService } from "../../service/auth/login";

export const loginController = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const result = await loginService(req.body)

        req.session.user = {
            id : result.id,
            role : result.id_role,
            companyId : result.id_company
        }

        res.status(200).json({
            message : "Login success",
            data : result
        })
    } catch (error : any) {
        next(error)
    }
}