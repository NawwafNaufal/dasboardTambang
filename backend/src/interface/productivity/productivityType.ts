export interface productivityType {
    actual_value: number,
    value_input: number,
    date: Date,
    id_plan: number,
    id_unit: number
}

export interface productivityTypeService extends productivityType {
    id : number
}