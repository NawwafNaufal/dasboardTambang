import express from "express";
import connection from "./config/connection"

const app = express()
const PORT = 4000

app.use(express.json())

import login from "./routes/auth/login"

app.get("/hhh",(req,res) => {
    res.send("Hello World")
})

app.get("/role",async(req,res) => {
    try {
        const query = "SELECT * FROM role"
        const [row] = await connection.execute(query)
    
        res.status(200).json({
            message : row 
        }) 
    } catch (error) {
        console.log(error)
    }
})

app.use("/auth",login)

app.listen(PORT, () => {
    console.log("Server listen in PORT :", PORT)
})

