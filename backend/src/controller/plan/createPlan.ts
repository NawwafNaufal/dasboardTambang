import { Request,Response,NextFunction } from "express";
import { createPlanService } from "../../service/plan/createPlan";

export const createPlanController = async (req : Request,res : Response, next : NextFunction) : Promise<void> => {
    const {plan,rkap,date} = req.body
    
        const result = await createPlanService({plan,rkap,date})

        res.status(200).json({
            message : "Data berhasil di tambahkan",
            data : {
                id : result,
                plan : plan,
                rkap : rkap,
                date : date
            }
        })
}