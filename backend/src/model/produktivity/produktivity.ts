import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { productivityType } from "../../interface/productivity/productivityType";

export const createProductivity = async (payload : productivityType) : Promise<number> => {
    const query = `INSERT INTO produktivity 
                    (plan,actual_value,rkpa,tanggal,id_company,id_unit,id_activity) 
                    VALUES (?,?,?,?,?,?,?)`
    const {plan,actual_value,rkpa,tanggal,id_company,id_unit,id_activity} = payload

        const [rows] = await connection.execute<ResultSetHeader>
        (query,[plan,actual_value,rkpa,tanggal,id_company,id_unit,id_activity])

            return rows.insertId
}

export const getProductivity = async () : Promise<productivityType[]> => {
    const query = `SELECT 
                    plan,actual_value,rkpa,tanggal,id_company,id_unit,id_activity 
                    FROM produktivity`

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as productivityType[]
} 

export const updateProductivity = async (role_name : string, id : number) : Promise<number> => {
    const query = "UPDATE company SET company_name = ? WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name,id])
            return rows.affectedRows
}

export const deleteProduktivity = async (id : number) : Promise<number> => {
    const query = "DELETE FROM company WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
} 