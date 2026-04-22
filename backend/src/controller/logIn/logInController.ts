import { NextFunction,Request,Response} from "express";
import { loginService } from "../../service/logIn/logInService";


export const loginController = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const result = await loginService(req.validatedBody)

        req.session.user = {
            username : result.username
        }
    
        res.status(200).json({
            message : "Login Berhasil",
            data : result
        }) 
    } catch (error : any) {
        return next(error)
    }
}