import connection from "../../config/connection";

export const findByUsername = async (username : string) => {
    const query  = `SELECT id,username,password 
                    FROM users 
                    WHERE username = ?
                    LIMIT 1` 

    const [rows] : any = await connection.execute(query,[username])
        return rows[0]
}  