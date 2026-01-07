import { Request,Response,NextFunction } from "express";
import { updateUsersService } from "../../service/users/updateUsers.service";

export const updateUsersController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {id} = req.params
    const {username,password,id_company,id_role} = req.body

    const payload = {
        username : username,
        password : password,
        id_company : id_company,
        id_role : id_role,
        id : Number(id)
    }

    try {
        const result = await updateUsersService(payload)
        
            res.status(200).json({
                message : "Data users berhasil di update",
                data : result
            })
    } catch (error) {
        return next(error)
    }
}