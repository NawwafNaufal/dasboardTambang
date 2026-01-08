import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { activityType } from "../../interface/activity/activity";

export const createActivity = async (role_name : string) : Promise<number> => {
    const query = "INSERT INTO activity (activity_name) VALUES (?)"

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name])
            return rows.insertId
}

export const getActivity = async () : Promise<activityType[]> => {
    const query = "SELECT activity_name FROM activity"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as activityType[]
} 

export const updateActivity = async (role_name : string, id : number) : Promise<number> => {
    const query = "UPDATE activity SET activity_name = ? WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name,id])
            return rows.affectedRows
}

export const deleteActivity = async (id : number) : Promise<number> => {
    const query = "DELETE FROM activity WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
} 