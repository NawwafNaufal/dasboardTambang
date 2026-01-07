import { Request,Response,NextFunction } from "express";
import { productivitySchema } from "../../validation/productivitySchema";

export const validateProductivity = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = productivitySchema.validate(req.body)

        if(error){
            return next(error)
        }

            req.body = value
                next()
}