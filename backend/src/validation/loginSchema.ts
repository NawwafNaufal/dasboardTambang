import Joi from "joi"

const loginSchema = Joi.object({
                username: Joi.string()
                            .required()
                            .max(26)
})
