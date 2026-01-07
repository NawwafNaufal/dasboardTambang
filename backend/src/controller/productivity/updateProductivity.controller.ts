import { Request,Response,NextFunction } from "express";
import { updateProductivityService } from "../../service/productivity/updateProductivity.service";

export const updateProductivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {actual_value,value_input,date,id_plan,id_unit} = req.body
    const id = Number(req.params.id)

    try {
        const result = await updateProductivityService({actual_value,value_input,date,id_plan,id_unit,id})
    
        res.status(200).json({
            message : "Update data berhasil",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}