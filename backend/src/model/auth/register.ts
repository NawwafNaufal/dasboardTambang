import connection from "../../config/connection";
import { registerType } from "../../interface/auth";
import bcrypt from "bcrypt"
import { ResultSetHeader } from "mysql2";

export const registerUser = async ( payload : registerType ) : Promise<number> => {
    const {username,password,id_company,id_role} = payload

    const hashingPassword = await bcrypt.hash(password,10)

    const query = `INSERT INTO users 
                    (username,password,id_company,id_role)
                    VALUES
                    (?,?,?,?)`
    
<<<<<<< HEAD
=======
    
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
    const data = [username,hashingPassword,id_company,id_role]


    const [rows] = await connection.execute<ResultSetHeader>(query,data)

    return rows.insertId
} 