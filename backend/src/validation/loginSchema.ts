import Joi from "joi"

export const loginSchema = Joi.object({
                username: Joi.string()
                            .required()
                            .trim()
                            .min(3)
                            .max(26),
                password: Joi.string()
                            .required()
                            .min(3)
})
