import { Request,Response,NextFunction } from "express";
import { roleSchema } from "../../validation/roleSchema";

export const validationnRole = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = roleSchema.validate(req.body)

    if(error){
        return next(error)
    }

    req.body = value
        next()
}