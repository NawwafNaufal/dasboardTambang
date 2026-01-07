import { Request,Response,NextFunction } from "express";
import { updateUnitService } from "../../service/unit/updateUnit";

export const updateUnitController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)
    const {unit_name} = req.body

    try {
        const result = await updateUnitService({unit_name,id})
        
            res.status(200).json({
                message : "Data unit berhasil di update",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}