import { parseNum } from "../../utils/parseNum";

export const transformCotonFields = (row: string[]) => {
    const plan = parseNum(row[4])
    const actual = parseNum(row[5])
    const rkap = parseNum(row[6])
    const reason = row[11]?.trim() || undefined

    const breakdown = {
        toppabiring: parseNum(row[7]),
        batara: parseNum(row[8]),
        utsg: parseNum(row[9]),
        annur: parseNum(row[10]),
};

    const filteredBreakdown = Object.fromEntries(
        Object.entries(breakdown).filter(([, v]) => v !== null)
    );

    return {
        unit: "ton",
        plan,
        actual,
        rkap,
        reason,
        breakdown:
            Object.keys(filteredBreakdown).length > 0
                ? filteredBreakdown
                : undefined,
    };
};
