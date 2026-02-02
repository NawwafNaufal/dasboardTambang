import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { unitType } from "../../interface/unit/typeUnit";
import { RowDataPacket } from "mysql2";
import { unitTypeService } from "../../interface/unit/typeUnit";

export const createUnit = async (payload : unitType ) : Promise<number> => {
    const {unit_name,id_activity} = payload

        const query = "INSERT INTO unit (unit_name,id_activity) VALUES (?,?)"

            const [rows] = await connection.execute<ResultSetHeader>(query,[unit_name,id_activity])
                return rows.insertId
}

export const getUnit = async () : Promise<unitType[]> => {
    const query = "SELECT unit_name FROM unit"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as unitType[]
}

export const updateUnit = async (payload : unitTypeService) : Promise<number> => {
    const {unit_name,id_activity,id} = payload

        const query = "UPDATE unit SET unit_name = ?, id_activity = ? WHERE id = ?"

            const [rows] = await connection.execute<ResultSetHeader>(query,[unit_name,id_activity,id])
                return rows.affectedRows
}

export const deleteUnit = async (id : number) : Promise<number> => {
    const query = "DELETE FROM unit WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
}

export const isDeletable = async (id_activity : number) : Promise<boolean> => {
    const query = "SELECT 1 FROM produktivity WHERE id_unit = ? LIMIT 1"

        const [rows] = await connection.execute<any[]>(query,[id_activity])
            return rows.length === 0
}