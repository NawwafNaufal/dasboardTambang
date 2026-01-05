import { Request,Response,NextFunction } from "express";
import { createUnitService } from "../../service/unit/createUnit";

export const createUnitController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {unit_name} = req.body

    try {
        const result = await createUnitService(unit_name)
    
            res.status(200).json({
                message : "Data unit berhasil ditambahkan",
                data : result 
            })
    } catch (error) {
        return next(error)
    }
}