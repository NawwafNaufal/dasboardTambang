import express from "express";
import connection from "./config/connection"
import { sessionConfig } from "./config/session";

const app = express()
const PORT = 4000

app.use(express.json())
app.use(sessionConfig)

import login from "./routes/auth/login"
import register from "./routes/auth/register"
import {error} from "./middleware/errorHandling/error"

app.use("/auth",login)
app.use("/auth",register)

app.use(error)

app.listen(PORT, () => {
    console.log("Server listen in PORT :", PORT)
})

