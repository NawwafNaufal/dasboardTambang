export interface loginType {
    username : string,
    password : string,
}

export interface registerType extends loginType{
    id_company : number,
    id_role : number,
}