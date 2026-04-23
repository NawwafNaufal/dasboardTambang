import  Express  from "express";
import { logoutController } from "../../controller/logIn/logoutController";

const route = Express.Router()

route.post("/log-out",logoutController)


export default route