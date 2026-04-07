import { parseNum } from "../../../utils/parseNum";

export const transformLoadingHauling = (row: string[]) => {
    const plan = parseNum(row[4])
    const pa = parseNum(row[10])
    const ua = parseNum(row[11])
    const ma = parseNum(row[12])
    const eu = parseNum(row[13])

    const produktivityIndex = {
        lbgJam: parseNum(row[7]),
        mtrJam: parseNum(row[8]),
        ltrJam: parseNum(row[9]),
};

    const filteredBreakdown = Object.fromEntries(
        Object.entries(produktivityIndex).filter(([, v]) => v !== null)
    );

    return {
        unit: "ton",
        plan,
        pa,
        ua,
        ma,
        eu,
        produktivityIndex:
            Object.keys(filteredBreakdown).length > 0
                ? filteredBreakdown
                : undefined,
    };
};
