import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { unitType } from "../../interface/unit/typeUnit";
import { RowDataPacket } from "mysql2";

export const createUnit = async (unit_name : string) : Promise<number> => {
    const query = "INSERT INTO unit (unit_name) VALUES (?)"

    const [rows] = await connection.execute<ResultSetHeader>(query,[unit_name])
        return rows.insertId
}

export const getUnit = async () : Promise<unitType[]> => {
    const query = "SELECT unit_name FROM unit"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as unitType[]
}

export const updateUnit = async (unit_name : string, id : number) : Promise<number> => {
    const query = "UPDATE unit SET unit_name = ? WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[unit_name,id])
            return rows.affectedRows
}

export const deleteUnit = async (id : number) : Promise<number> => {
    const query = "DELETE FROM unit WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
}