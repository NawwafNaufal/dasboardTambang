import { Request,Response,NextFunction } from "express";
import { updateUnitService } from "../../service/unit/updateUnit.service";

export const updateUnitController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {id,id_activity} = req.params
    const {unit_name} = req.body

    const payload = {
        id : Number(id),
        id_activity : Number(id_activity),
        unit_name : unit_name
    }

    try {
        const result = await updateUnitService(payload)
        
            res.status(200).json({
                message : "Data unit berhasil di update",
                data : {
                    id : result,
                    unit_name : unit_name
                }
            })
    } catch (error) {
        return next(error)
    }
}