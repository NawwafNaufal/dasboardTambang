import connection from "../../config/connection";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { productivityType } from "../../interface/productivity/productivityType";
import { productivityTypeService } from "../../interface/productivity/productivityType";
import { SummaryRow } from "../../interface/productivity/productivityType";
import { DetailRow } from "../../interface/productivity/productivityType";
import { ChartRow } from "../../interface/productivity/productivityType";

export const createProductivity = async (payload : productivityType) : Promise<number> => {
    const query = `INSERT INTO produktivity 
                    (actual_value,value_input,date,id_plan,id_unit) 
                    VALUES (?,?,?,?,?)`

    const {actual_value,value_input,date,id_plan,id_unit} = payload

        const [rows] = await connection.execute<ResultSetHeader>
        (query,[actual_value,value_input,date,id_plan,id_unit])

            return rows.insertId
}

export const updateProductivity = async (payload : productivityTypeService) : Promise<number> => {

    const {actual_value,value_input,date,id_plan,id_unit,id} = payload

    const query = "UPDATE produktivity SET actual_value = ?,value_input = ?,date = ?,id_plan = ?,id_unit = ?  WHERE id = ? "

        const [rows] = await connection.execute<ResultSetHeader>(query,[actual_value,value_input,date,id_plan,id_unit,id])
            return rows.affectedRows
}

export const deleteProduktivity = async (id : number) : Promise<number> => {
    const query = "DELETE FROM produktivity WHERE id = ?"

        const [rows] = await connection.execute<ResultSetHeader>(query,[id])
        console.log("ddhjdhd",rows)
            return rows.affectedRows
} 

export const getSummaryByMonthRepo = async (
    month: number,
    year: number
): Promise<SummaryRow[]> => {

const [rows] = await connection.execute<RowDataPacket[] & SummaryRow[]>(
            `SELECT produktivity.date,activity.activity_name,mp.plan,mp.rkap,SUM(produktivity.value_input) AS actual
                        FROM produktivity
                        JOIN unit ON unit.id = produktivity.id_unit
                        JOIN activity ON activity.id = unit.id_activity
                        JOIN monthly_plan mp ON mp.id = produktivity.id_plan
                        WHERE MONTH(produktivity.date) = ? AND YEAR(produktivity.date) = ?
                        GROUP BY produktivity.date,activity.id,activity.activity_name,mp.plan,mp.rkap
                        ORDER BY produktivity.date ASC`,
    [month, year]
);
    return rows;
};

export const getDetailByMonthRepo = async (
    month: number,
    year: number
): Promise<DetailRow[]> => {

const [rows] = await connection.execute<RowDataPacket[] & DetailRow[]>(
    `SELECT produktivity.date,unit.unit_name,produktivity.value_input
                FROM produktivity JOIN unit ON unit.id = produktivity.id_unit
                WHERE MONTH(produktivity.date) = ? AND YEAR(produktivity.date) = ? ORDER BY produktivity.date ASC;`,
    [month, year]
);
    return rows;
};

export const getChartByYearRepo = async (
    year: number
): Promise<ChartRow[]> => {

const [rows] = await connection.execute<RowDataPacket[] & ChartRow[]>(
    `SELECT MONTH(produktivity.date) as month,activity.activity_name,SUM(produktivity.value_input) AS actual
                FROM produktivity
                JOIN unit ON unit.id = produktivity.id_unit
                JOIN activity ON activity.id = unit.id_activity
                WHERE YEAR(produktivity.date) = ?
                GROUP BYMONTH(produktivity.date),activity.id,activity.activity_name
                ORDER BY MONTH(produktivity.date) ASCactivity.activity_name ASC`,
    [year]
);
    return rows;
};

export const countProduktivity = async (): Promise<number> => {
        const query = `SELECT COUNT(*) as total FROM produktivity`
            const [[result]] = await connection.execute<RowDataPacket[]>(query)
                return result?.total ?? 0 
}
