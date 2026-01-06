import { Request,Response,NextFunction } from "express";
import { getUnitService } from "../../service/unit/getUnit";

export const getUnitController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    
    try {
        const result = await getUnitService()
    
            res.status(200).json({
                message : "Data unit",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}