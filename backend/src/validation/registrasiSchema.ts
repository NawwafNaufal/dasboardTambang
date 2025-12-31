import Joi from "joi"

export const registerSchema = Joi.object({
                    username : Joi.string()
                                .min(3)
                                .max(26)
                                .trim()
                                .required(),
                    password : Joi.string()
                                .min(8)
                                .max(36)
                                .required(),
                    id_company : Joi.number()
                                .integer()
                                .positive()
                                .required(),
                    id_role : Joi.number()
                                .integer()
                                .positive()
                                .required()
}).options({
    abortEarly : false,
    allowUnknown : false
})