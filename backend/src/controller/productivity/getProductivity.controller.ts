import { Request,Response,NextFunction } from "express";
import { getProductivityService } from "../../service/productivity/getProductivity.service";

export const getProductivityController = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await getProductivityService()
    
        res.status(200).json({
            message : "Data Company",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}