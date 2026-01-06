import Joi from "joi";

export const productivitySchema = Joi.object({
  actual_value: Joi.number()
    .required()
    .messages({
      "number.base": "actual_value harus berupa angka",
      "any.required": "actual_value wajib diisi"
    }),

  value_input: Joi.number()
    .required()
    .messages({
      "number.base": "value_input harus berupa angka",
      "any.required": "value_input wajib diisi"
    }),

  date: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "date harus berupa tanggal",
      "date.format": "date harus format ISO (YYYY-MM-DD)",
      "any.required": "date wajib diisi"
    }),

  id_plan: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "id_plan harus berupa angka",
      "number.integer": "id_plan harus bilangan bulat",
      "number.positive": "id_plan harus lebih dari 0",
      "any.required": "id_plan wajib diisi"
    }),

  id_unit: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "id_unit harus berupa angka",
      "number.integer": "id_unit harus bilangan bulat",
      "number.positive": "id_unit harus lebih dari 0",
      "any.required": "id_unit wajib diisi"
    })
});
