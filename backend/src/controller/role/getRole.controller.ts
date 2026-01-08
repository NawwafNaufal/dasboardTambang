import { Request,Response,NextFunction } from "express";
import { getRoleService } from "../../service/role/getRole.service";
import { isDeletableService } from "../../service/role/getRole.service";

export const getRoleController = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await getRoleService()
    
        res.status(200).json({
            message : "Data Role",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}

export const isDeletableController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const id_role = Number(req.params.id_unit)

        const result = await isDeletableService(id_role)

            res.status(200).json({
                message : "Detail",
                isDeletable : result
            })
    } catch (error) {
        return next(error)
    }
}