import mysql from "mysql2"
import "dotenv/config"

const connection = mysql.createPool({
    user : process.env.DB_USER!,
    password : process.env.DB_PASSWORD!,
    host : process.env.DB_HOST!,
    database : process.env.DB_NAME!
})

export default connection.promise()