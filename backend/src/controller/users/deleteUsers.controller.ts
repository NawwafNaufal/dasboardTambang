import { Request,Response,NextFunction } from "express";
import { deleteUsersService } from "../../service/users/deleteUsers.service";

export const deleteUsersController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deleteUsersService(id)

        res.status(200).json({
            message : "Data unit berhasil dihapus",
            data : result
        }) 
    } catch (error) {
        return next(error)
    }
}