import express from "express";
import { sessionConfig } from "./config/session";
import "dotenv/config"

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(sessionConfig)

import login from "./routes/auth/login"
import register from "./routes/auth/register"
import {error} from "./middleware/errorHandling/error"

import createRole from "./routes/role/role.route"
import unit from "./routes/unit/unit.route"
import createRole from "./routes/role/role"
import unit from "./routes/unit/unit"
import company from "./routes/company.ts/company"
import plan from "./routes/plan/plan.route"
import activity from "./routes/activity/activity"
import plan from "./routes/plan/plan"
import productivity from "./routes/productivity/productivity"
import users from "./routes/users/users.route"
import userActivity from "./routes/userActivity/userActivity.route"

app.use("/auth",login)
app.use("/auth",register)

app.use("/",createRole)
app.use("/",unit)
app.use("/",company)
app.use("/",activity)
app.use("/",plan)
app.use("/",productivity)
app.use("/",users)
app.use("/",userActivity)

app.use(error)

app.listen(PORT, () => {
    console.log("Server listen in PORT :", PORT)
})

