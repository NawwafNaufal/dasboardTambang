import { Request,Response,NextFunction } from "express";
import { loginSchema } from "../../validation/loginSchema";

export const validationLogin = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = loginSchema.validate(req.body)

    if (error) {
        return next(error)
    }

    req.body = value
        return next()
}