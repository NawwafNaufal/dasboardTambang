import { Request,Response,NextFunction } from "express";
import { deleteProductivityService } from "../../service/productivity/deleteProductivity.service";

export const deleteProductivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deleteProductivityService(id)
    
            res.status(200).json({
                message : "Data berhasil di hapus",
                data : result
            })
    } catch (error) {
        return next(error)
    }

}
