import { Request,Response,NextFunction } from "express";
import { getUnitService } from "../../service/unit/getUnit.service";
import { isDeletableService } from "../../service/unit/getUnit.service";

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

export const isDeletableController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const id_activity = Number(req.params.id_activity)

        const result = await isDeletableService(id_activity)

            res.status(200).json({
                message : "Detail",
                isDeletable : result
            })
    } catch (error) {
        return next(error)
    }
}