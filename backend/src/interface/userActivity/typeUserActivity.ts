export interface typeUserActivity {
    id_user : number,
    id_activity : number
}

export interface typeUserActivityPatch extends typeUserActivity{
    id : number
}