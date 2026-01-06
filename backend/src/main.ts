import "dotenv/config"
import express from "express";
import { sessionConfig } from "./config/session";

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(sessionConfig)

import login from "./routes/auth/login"
import register from "./routes/auth/register"
import {error} from "./middleware/errorHandling/error"

import company from "./routes/company.ts/company"
import productivity from "./routes/productivity/productivity"

app.use("/auth",login)
app.use("/auth",register)

app.use("/",company)
app.use("/",productivity)

app.use(error)

app.listen(PORT, () => {
    console.log("Server listen in PORT :", PORT)
})

