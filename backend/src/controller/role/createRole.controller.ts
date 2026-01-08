import { Request,Response,NextFunction } from "express";
import { createRoleService } from "../../service/role/createRole.service";
import { roleType } from "../../interface/role/typeRole";

export const createRoleController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const payload : roleType = req.body
    
        const result = await createRoleService(payload)
    
        res.status(200).json({
            message : "Create role success",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}