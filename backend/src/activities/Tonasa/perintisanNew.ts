import { parseNum } from "../../utils/parseNum";

export const transformPerintisanNew = (row: string[]) => {
    const plan = parseNum(row[22]);
    const actual = parseNum(row[23]);
    const reason = row[26]?.trim() || undefined;

    const breakdown = {
        "PCR-02": parseNum(row[24]),
        "PCR-03": parseNum(row[25]),
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