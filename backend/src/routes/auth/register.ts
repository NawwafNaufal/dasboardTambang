import express from "express"
import { registerController } from "../../controller/auth/register"
import { validationRegister } from "../../middleware/auth/validationRegister"

const route = express.Router()

route.post("/register",validationRegister,registerController)

export default route