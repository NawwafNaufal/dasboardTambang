import { Request,Response,NextFunction } from "express";
import { updateActivityService } from "../../service/activity/updateActivity";

export const updateActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {activity_name} = req.body
    const id = Number(req.params.id)

    try {
        const result = await updateActivityService({activity_name,id})
    
        res.status(200).json({
            message : "Update data berhasil",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}