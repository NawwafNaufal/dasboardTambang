import Joi from "joi"

export const unitSchema = Joi.object({
                unit_name : Joi.string()
                            .required()
})