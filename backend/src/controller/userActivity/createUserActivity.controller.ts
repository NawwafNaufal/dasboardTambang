import { Request,Response,NextFunction } from "express";
import { createUserActivityService } from "../../service/userActivity/createUserActivity.service";

export const createUserActivityController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {id_user,id_activity} = req.body

    try {
        const result = await createUserActivityService({id_user,id_activity})
    
            res.status(200).json({
                message : "Data userActivity berhasil ditambahkan",
                data : result 
            })
    } catch (error) {
        return next(error)
    }
}