import { Request,Response,NextFunction } from "express";
import { activitySchema } from "../../validation/activitySchema";

export const validateActivity = (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = activitySchema.validate(req.body)

        if(error) {
            return next(error)
        }

        req.body = value
            next()
}