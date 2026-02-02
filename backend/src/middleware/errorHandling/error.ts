import { Request,Response,NextFunction } from "express";
import { responseError } from "../../error/responseError";
import { ValidationError } from "joi";
import { logger } from "../../log/winston";

export const error = (err: any, req : Request, res : Response, next : NextFunction) => {
    if(!err){
        next()
        return 
    }
    if(err instanceof responseError){
        logger.warn(`${err.message} ${err.stack}`)
        return res.status(err.status).json({
            errors : err.message
        })
    }
    if(err instanceof ValidationError){
        logger.warn(`${err.message} ${err.stack}`)
        return res.status(400).json({
            errors : err.message
        })
    }
    else {
        logger.warn(`${err.message} ${err.stack}`)
        return res.status(500).json({
            errors : "Server internal error"
        })
    }
}