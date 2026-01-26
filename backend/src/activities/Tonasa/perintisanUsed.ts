import { parseNum } from "../../utils/parseNum";

export const transformPerintisanUsed = (row: string[]) => {
    if (row.length < 22) return null;

    const plan = parseNum(row[18]);
    const actual = parseNum(row[19]);
    const reason = row[21]?.trim() || undefined

    const breakdown = {
        "PCR-01": parseNum(row[20]),
    };

    const filteredBreakdown = Object.fromEntries(
        Object.entries(breakdown).filter(([, v]) => v !== null)
    );

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
