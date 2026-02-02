import { Request,Response,NextFunction } from "express";
import { updateUserActivityService } from "../../service/userActivity/updateUserActivity.service";

export const updateUserActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)
    const {id_user,id_activity} = req.body

    try {
        const result = await updateUserActivityService({id_user,id_activity,id})
        
            res.status(200).json({
                message : "Data unit berhasil di update",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}