export interface typeUsers {
    username : string,
    password : string,
    id_company : number,
    id_role : number
}

export interface typeUserService extends typeUsers {
    id : number
}