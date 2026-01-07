import { Request,Response,NextFunction } from "express";
import { deleteUnitService } from "../../service/unit/deleteUnit";

export const deleteUnitController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

        const result = await deleteUnitService(id)

        res.status(200).json({
            message : "Data unit berhasil dihapus",
            data : result
        })
}