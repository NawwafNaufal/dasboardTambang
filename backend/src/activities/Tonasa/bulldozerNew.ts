import { parseNum } from "../../utils/parseNum";

export const transformBulldozerNew = (row: string[]) => {

    const plan = parseNum(row[32]);
    const actual = parseNum(row[33]);
    const reason = row[36]?.trim() || undefined

    const breakdown = {
        "D-01": parseNum(row[34]),
        "D-02": parseNum(row[35]),
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
