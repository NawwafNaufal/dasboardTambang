import { parseNum } from "../../utils/parseNum";

export const transformStock = (row: string[]) => {
    const plan = parseNum(row[8])
    const actual = parseNum(row[9])
    const rkap = parseNum(row[10])
    const reason = row[11]?.trim() || undefined


    return {
        unit: "ton",
        plan,
        actual,
        rkap,
        reason,
    };
};
