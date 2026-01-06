import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { companyType } from "../../interface/company/company";

export const createCompany = async (role_name : string) : Promise<number> => {
    const query = "INSERT INTO company (company_name) VALUES (?)"

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name])
            return rows.insertId
}

export const getCompany = async () : Promise<companyType[]> => {
    const query = "SELECT company_name FROM company"

        const [rows] = await connection.execute<RowDataPacket[]>(query)
            return rows as companyType[]
} 

export const updateCompany = async (role_name : string, id : number) : Promise<number> => {
    const query = "UPDATE company SET company_name = ? WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[role_name,id])
            return rows.affectedRows
}

export const deleteCompany = async (id : number) : Promise<number> => {
    const query = "DELETE FROM company WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
            return rows.affectedRows
} 