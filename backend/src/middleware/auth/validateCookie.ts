import { Request,Response,NextFunction } from "express";

export const validateCookie = (req : Request,res : Response, next : NextFunction) =>  {
    if (!req.session.user){
        return res.status(200).json({
            message : "Unauthorize"
        })
    }
    next()
}

