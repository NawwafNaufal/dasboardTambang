import { Request,Response,NextFunction } from "express";
import { deleteUserActivityService } from "../../service/userActivity/deleteUserActivity.service";

export const deleteUserActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deleteUserActivityService(id)

        res.status(200).json({
            message : "Data userActivity berhasil dihapus",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}