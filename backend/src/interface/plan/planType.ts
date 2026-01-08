export interface planType {
    plan : number,
    rkap? : number,
    date : Date
}

export interface planTypeService extends planType {
    id : number
}