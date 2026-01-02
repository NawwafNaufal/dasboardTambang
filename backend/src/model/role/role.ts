import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { roleType } from "../../interface/role/typeRole";
import { RowDataPacket } from "mysql2";

export const createRole = async (role_name : string) : Promise<number> => {
    const query = "INSERT INTO role (role_name) VALUES (?)"

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name])
            return rows.insertId
}

export const getRole = async () : Promise<roleType[]> => {
    const query = "SELECT role_name FROM role"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as roleType[]
} 

export const updateRole = async (role_name : string, id : number) : Promise<number> => {
    const query = "UPDATE role SET role_name = ? WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name,id])
            return rows.insertId
}