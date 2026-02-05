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

export interface PaginationProduktivityResult {
    data: productivityType[]
    total: number
}

<<<<<<< HEAD
=======

>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
export interface SummaryRow {
    date: string;
    activity_name: string;
    plan: number;
    rkap: number;
    actual: number;
}

export interface DetailRow {
    date: string;
    unit_name: string;
    value_input: number;
}

export interface ChartRow {
    month: number;
    activity_name: string;
    actual: number;
}