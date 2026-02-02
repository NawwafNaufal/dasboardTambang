import { parseNum } from "../../utils/parseNum";

export const transformBreaker = (row: string[]) => {

    const plan = parseNum(row[37]);
    const actual = parseNum(row[38]);
    const reason = row[41]?.trim() || undefined

    const breakdown = {
        "B-35": parseNum(row[39]),
        "B-36": parseNum(row[40]),
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
