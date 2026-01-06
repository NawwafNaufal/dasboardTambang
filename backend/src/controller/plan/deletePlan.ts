import { Request,Response,NextFunction } from "express";
import { deletePlanService } from "../../service/plan/deletePlan";

export const deletePlanController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deletePlanService(id)
    
            res.status(200).json({
                message : "Data berhasil di hapus",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}