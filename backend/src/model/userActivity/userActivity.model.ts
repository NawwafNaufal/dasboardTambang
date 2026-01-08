import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { typeUserActivity } from "../../interface/userActivity/typeUserActivity";
import { typeUserActivityPatch } from "../../interface/userActivity/typeUserActivity";

export const createUserActivity = async (payload : typeUserActivity) : Promise<number> => {
    const {id_user,id_activity} = payload

        const query = "INSERT INTO users_activity (id_user,id_activity) VALUES (?,?)"

    const [rows] = await connection.execute<ResultSetHeader>(query,[id_user,id_activity])
        return rows.insertId
}

export const getUserActivity = async () : Promise<typeUserActivity[]> => {
    const query = "SELECT id_user,id_activity FROM users_activity"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as typeUserActivity[]
}

export const updateUserActivity = async (payload : typeUserActivityPatch) : Promise<number> => {
    const {id_user,id_activity,id} = payload
    const query = "UPDATE users_activity SET id_user = ? id_activity = ? WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id_user,id_activity,id])
            return rows.affectedRows
}

export const deleteUserActivity = async (id : number) : Promise<number> => {
    const query = "DELETE FROM users_activity WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
}