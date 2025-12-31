import { Request,Response,NextFunction } from "express";
import { registerSchema } from "../../validation/registrasiSchema";

export const validationRegister = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = registerSchema.validate(req.body)

    if(error){
        return next(error)
    }

    req.body = value
        next()
}