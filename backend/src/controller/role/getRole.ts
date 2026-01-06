import { Request,Response,NextFunction } from "express";
import { getRoleService } from "../../service/role/getRole";

export const getRoleController = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await getRoleService()
    
        res.status(200).json({
            message : "Data Role",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}