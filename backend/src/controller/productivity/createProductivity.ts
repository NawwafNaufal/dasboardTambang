import { Request,Response,NextFunction } from "express";
import { productivityType } from "../../interface/productivity/productivityType";
import { createProductivityService } from "../../service/productivity/createProductivity";

export const createProductivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const payload : productivityType = req.body
    
        const result = await createProductivityService(payload)
    
        res.status(200).json({
            message : "Create productivity success",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}