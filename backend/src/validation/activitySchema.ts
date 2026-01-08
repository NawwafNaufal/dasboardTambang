import Joi from "joi"

export const activitySchema = Joi.object({
            activity_name : Joi.string()
                            .required()
})