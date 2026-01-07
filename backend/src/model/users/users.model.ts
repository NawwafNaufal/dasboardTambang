import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt"
import { typeUsers } from "../../interface/users/typeUsers";
import { typeUserService } from "../../interface/users/typeUsers";

export const getUsers = async () : Promise<typeUsers[]> => {
    const query = "SELECT username,password,id_company,id_role FROM users"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as typeUsers[]
} 

export const updateUsers = async (payload : typeUserService) : Promise<number> => {
    const {username,password,id_company,id_role,id} = payload

    const hashingPassword = await bcrypt.hash(password,10)

    const query = "UPDATE users SET username = ?,password = ?,id_company = ?,id_role = ? WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[username,hashingPassword,id_company,id_role,id])
            return rows.affectedRows
}

export const deleteUsers = async (id : number) : Promise<number> => {
    const query = "DELETE FROM users WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
} 