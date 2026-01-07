import connection from "../../config/connection";
import { planType } from "../../interface/plan/planType";
import { ResultSetHeader } from "mysql2";
import { planTypeService } from "../../interface/plan/planType";
import { RowDataPacket } from "mysql2";

export const createPlan = async (payload : planType) : Promise<number> => {

    const {plan,rkap,date} = payload

    const query = "INSERT INTO monthly_plan (plan,rkap,date) VALUES (?,?,?)"

        const [rows] = await connection.execute<ResultSetHeader>(query,[plan,rkap,date])
            return rows.insertId
}

export const getPlan = async () : Promise<planType[]> => {
    const query = "SELECT plan,rkap,date FROM monthly_plan"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as planType[]
} 

export const updatePlan = async (plan : number,rkap : number | undefined,date : Date,id : number) : Promise<number> => {

    const query = "UPDATE monthly_plan SET plan = ?, rkap = ?,date = ? WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[plan,rkap ?? null,date,id])
            return rows.affectedRows
}

export const deletePlan = async (id : number) : Promise<number> => {
    const query = "DELETE FROM monthly_plan WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
} 

export const isDeletable = async (id_activity : number) : Promise<boolean> => {
    const query = "SELECT 1 FROM produktivity WHERE id_plan = ? LIMIT 1"

        const [rows] = await connection.execute<any[]>(query,[id_activity])
            return rows.length === 0
}