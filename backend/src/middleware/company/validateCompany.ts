import { Request,Response,NextFunction } from "express";
import { companySchema } from "../../validation/companySchema";

export const validateCompany = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = companySchema.validate(req.body)

        if(error) {
            return next(error)
        }

        req.body = value
            next()
}