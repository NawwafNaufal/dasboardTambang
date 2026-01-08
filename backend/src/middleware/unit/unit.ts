import { Request,Response,NextFunction } from "express";
import { unitSchema } from "../../validation/unitSchema";

export const validateUnit = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = unitSchema.validate(req.body,{
        abortEarly : false
    })

        if(error){
            return next(error)
        }

        req.body = value
            next()
}