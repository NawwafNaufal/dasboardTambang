import { Request,Response,NextFunction } from "express";
import { companyType } from "../../interface/company/company";
import { createCompanyService } from "../../service/company/createCompany.service";

export const createCompanyController = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
        const payload : companyType = req.body
    
        const result = await createCompanyService(payload)
    
        res.status(200).json({
            message : "Create company success",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}