import { Request,Response,NextFunction } from "express";
import { getActivityService } from "../../service/activity/getActivity.service";

export const getActivityController = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await getActivityService()
    
        res.status(200).json({
            message : "Data Activity",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}