import connection from "../../config/connection";
import { authType } from "../../interface/auth/login";

export const findByUsername = async (username : string) : Promise<authType | null> => {
    const query  = `SELECT 
                    username,password,id_role,id_company                  
                    FROM users 
                    WHERE username = ?
                    LIMIT 1` 

    const [rows] = await connection.execute<authType[]>(query,[username])
        return rows[0] ?? null
}  