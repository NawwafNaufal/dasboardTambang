import Joi from "joi";

export const createPlanSchema = Joi.object({
                        plan: Joi.number()
                                .positive()
                                .required()
                                .messages({
                                    "number.base": "Plan harus berupa angka",
                                    "number.positive": "Plan harus lebih dari 0",
                                    "any.required": "Plan wajib diisi"
}),
                        rkap: Joi.number()
                                .positive()
                                .required()
                                .messages({
                                    "number.base": "RKAP harus berupa angka",
                                    "number.positive": "RKAP harus lebih dari 0",
                                    "any.required": "RKAP wajib diisi"
}),

                        date: Joi.date()
                                .required()
                                .messages({
                                    "date.base": "Date harus berupa tanggal",
                                    "any.required": "Date wajib diisi"
    })
});
