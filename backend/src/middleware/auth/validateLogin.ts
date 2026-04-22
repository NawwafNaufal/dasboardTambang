import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../../validation/loginSchema";

export const validateProductivity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  })

  if (error) {
    return next(error)
  }

  req.validatedBody = value
  next()
}