import Joi from "joi"

export const roleSchema = Joi.object({
            role_name : Joi.string()
                        .required()
})
                