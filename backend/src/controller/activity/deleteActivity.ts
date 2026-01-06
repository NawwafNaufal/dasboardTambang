import { Request,Response,NextFunction } from "express";
import { deleteActivityService } from "../../service/activity/deleteActivity";

export const deleteActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deleteActivityService(id)
    
            res.status(200).json({
                message : "Data berhasil di hapus",
                data : result
            })
    } catch (error) {
        return next(error)
    }

}