import  Express  from "express";
import { loginController } from "../../controller/logIn/logInController";
import { validateProductivity } from "../../middleware/auth/validateLogin";

const route = Express.Router()

route.post("/sign-in",validateProductivity,loginController)

export default route