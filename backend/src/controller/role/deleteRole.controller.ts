import { Request,Response,NextFunction } from "express";
import { deleteRoleService } from "../../service/role/deleteRole.service";

export const deleteRoleController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deleteRoleService(id)
    
            res.status(200).json({
                message : "Data berhasil di hapus",
                data : result
            })
    } catch (error) {
        return next(error)
    }

}

