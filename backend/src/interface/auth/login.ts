import { RowDataPacket } from "mysql2"

export interface authType extends RowDataPacket {
    username : string,
    password : string,
    id_role : number,
    id_company : number
}

export interface loginType {
    username : string,
    password : string,
}