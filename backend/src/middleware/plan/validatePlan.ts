import { Request,Response,NextFunction } from "express";
import { createPlanSchema } from "../../validation/planSchema";

export const validatePlan = async (req : Request, res : Response, next : NextFunction) => {
    const {error,value} = createPlanSchema.validate(req.body)

    if(error) {
        return next(error)
    }

    req.body = value
        next()
}