import { parseNum } from "../../utils/parseNum";

export const transformCotonFields = (row: string[]) => {
    const plan = parseNum(row[4])
    const actual = parseNum(row[5])
    const rkap = parseNum(row[6])
    const reason = row[7]?.trim() || undefined


    return {
        unit: "ton",
        plan,
        actual,
        rkap,
        reason,
    };
};
