import { Request,Response,NextFunction } from "express";
import { getPlanService } from "../../service/plan/getPlan";

export const getPlanController = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await getPlanService()
    
        res.status(200).json({
            message : "Data Plan",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}