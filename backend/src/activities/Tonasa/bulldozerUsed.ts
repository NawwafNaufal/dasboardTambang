import { parseNum } from "../../utils/parseNum";

export const transformBulldozerUsed = (row: string[]) => {
    const plan = parseNum(row[27]);
    const actual = parseNum(row[28]);
    const reason = row[31]?.trim() || undefined

    const breakdown = {
        "D-05": parseNum(row[29]),
        "D-06": parseNum(row[30]),
    };

    const filteredBreakdown = Object.fromEntries(
        Object.entries(breakdown).filter(([, v]) => v !== null)
    );

    if (plan === null && actual === null && Object.keys(filteredBreakdown).length === 0) {
            return null;
        }

    return {
        unit: "jam",
        plan,
        actual,
        reason,
        breakdown:
            Object.keys(filteredBreakdown).length > 0
            ? filteredBreakdown
            : undefined,
    };
};
