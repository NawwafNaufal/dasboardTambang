import { parseNum } from "../../utils/parseNum";

export const transformDrilling = (row: string[]) => {
    if (row.length < 16) return null;

    const plan = parseNum(row[12]);
    const actual = parseNum(row[13]);
    const reason = row[17]?.trim() || undefined

    const breakdown = {
        epiroc_01: parseNum(row[14]),
        epiroc_02: parseNum(row[15]),
        hcr_07: parseNum(row[16]),
    };

    const filteredBreakdown = Object.fromEntries(
        Object.entries(breakdown).filter(([, v]) => v !== null)
    );

    return {
        unit: "meter",
        plan,
        actual,
        breakdown:
            Object.keys(filteredBreakdown).length > 0
            ? filteredBreakdown
            : undefined,
    };
};
