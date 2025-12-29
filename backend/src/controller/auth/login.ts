import { Request,Response,NextFunction } from "express";
import { loginService } from "../../service/auth/login";

export const loginController = async (req : Request, res : Response, next : NextFunction) => {
    const {username,password} = req.body

    try {
        const result = await loginService({username,password})
    
        res.status(200).json({
            message : "Login success",
            data : result
        })
    } catch (error : any) {
        next(error)
    }
}