import { Request,Response,NextFunction } from "express";
import { registerService } from "../../service/auth/register";
import { registerType } from "../../interface/auth";

export const registerController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const payload : registerType = req.body 
    
            const result = await registerService(payload)
    
            res.status(200).json({
                mesage : "Create acount success",
                data : result
            })
    } catch (error) {
        next(error)
    }
}