import { Request,Response,NextFunction } from "express";
import { updatePlanService } from "../../service/plan/updatePlan";

export const updatePlanController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {plan,rkap,date} = req.body
    const id = Number(req.params.id)

    try {
        const result = await updatePlanService({plan,rkap,date,id})
    
        res.status(200).json({
            message : "Update data berhasil",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}