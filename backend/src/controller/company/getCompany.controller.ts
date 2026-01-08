import { Request,Response,NextFunction } from "express";
import { getCompanyService } from "../../service/company/getCompany.service";

export const getCompanyController = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await getCompanyService()
    
        res.status(200).json({
            message : "Data Company",
            data : result
        })
    } catch (error) {
        return next(error)
    }
}