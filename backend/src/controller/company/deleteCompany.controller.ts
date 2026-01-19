import { Request,Response,NextFunction } from "express";
import { deleteCompanyService } from "../../service/company/deleteCompany.service";

export const deleteCompanyController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const id = Number(req.params.id)

    try {
        const result = await deleteCompanyService(id)
    
            res.status(200).json({
                message : "Data berhasil di hapus",
                data : result
            })
    } catch (error) {
        return next(error)
    }

}