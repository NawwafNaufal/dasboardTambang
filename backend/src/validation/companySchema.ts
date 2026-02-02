import Joi from "joi"

export const companySchema = Joi.object({
            company_name : Joi.string()
                            .required()
})