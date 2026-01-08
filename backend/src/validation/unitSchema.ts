import Joi from "joi";

export const unitSchema = Joi.object({
                unit_name: Joi.string()
                            .required()
                            .messages({
                                "any.required": "unit_name wajib diisi",
                                "string.empty": "unit_name tidak boleh kosong"
    }),

                id_activity: Joi.number()
                            .integer()
                            .positive()
                            .required()
                            .messages({
                                "any.required": "id_activity wajib diisi",
                                "number.base": "id_activity harus berupa angka",
                                "number.integer": "id_activity harus bilangan bulat",
                                "number.positive": "id_activity harus lebih dari 0"
    })
});
