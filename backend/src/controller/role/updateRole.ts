import { Request,Response,NextFunction } from "express";
import { updateRoleService } from "../../service/role/updateRole";

export const updateRoleController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {role_name} = req.body
    const id = Number(req.params.id)

    try {
        const result = await updateRoleService({role_name,id})
    
        res.status(200).json({
            message : "Update data berhasil",
            data : result
        })
    } catch (error) {
        return next(error)
    }

}