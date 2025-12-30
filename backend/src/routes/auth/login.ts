import express from "express"
import { loginController } from "../../controller/auth/login"
import { validationLogin } from "../../middleware/auth/validationLogin"

const route = express.Router()

route.post("/login",validationLogin ,loginController)

export default route