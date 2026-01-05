import { Request,Response,NextFunction } from "express";
import { activityType } from "../../interface/activity/activity";
import { createActivityService } from "../../service/activity/createActivity";

export const createActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const payload : activityType = req.body
    
        const result = await createActivityService(payload)
    
        res.status(200).json({
            message : "Create activity success",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}