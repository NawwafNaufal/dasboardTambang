import express from "express"
import { loginController } from "../../controller/auth/login"

const route = express.Router()

route.post("/login",loginController)

export default route