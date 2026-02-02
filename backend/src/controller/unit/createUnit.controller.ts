import { Request,Response,NextFunction } from "express";
import { createUnitService } from "../../service/unit/createUnit.service";

export const createUnitController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {unit_name} = req.body
    const id_activity = Number(req.params.id_activity)

    try {
        const result = await createUnitService({unit_name,id_activity})
    
            res.status(200).json({
                message : "Data unit berhasil ditambahkan",
                data : {
                    id : result,
                    unit_name : unit_name
                }
            })
    } catch (error) {
        return next(error)
    }
}