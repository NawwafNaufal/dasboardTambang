import { Request,Response,NextFunction } from "express";
import { updateCompanyService } from "../../service/company/updateCompany.service";

export const updateCompanyController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const {company_name} = req.body
    const id = Number(req.params.id)

    try {
        const result = await updateCompanyService({company_name,id})
    
        res.status(200).json({
            message : "Update data berhasil",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}