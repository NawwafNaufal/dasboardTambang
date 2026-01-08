import { Request,Response,NextFunction } from "express";
import { getUserActivityService } from "../../service/userActivity/getUserActivity.service";

export const getUserActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    
    try {
        const result = await getUserActivityService()
    
            res.status(200).json({
                message : "Data userActivity",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}