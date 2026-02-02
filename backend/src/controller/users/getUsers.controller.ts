import { Request,Response,NextFunction } from "express";
import { getUsersService } from "../../service/users/getUsers.service";

export const getUsersController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    
    try {
        const result = await getUsersService()
    
            res.status(200).json({
                message : "Data users",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}