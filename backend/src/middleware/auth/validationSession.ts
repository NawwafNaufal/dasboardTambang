import { Request,Response,NextFunction } from "express";
import { responseError } from "../../error/responseError";

export const validateSession = (req : Request, res : Response, next : NextFunction) => {
        if(!req.session.user) {
            throw new responseError("Unauthorized",401)
        }
        next()
}