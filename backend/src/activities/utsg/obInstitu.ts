import { parseNum } from "../../utils/parseNum";
import { parsePrecent } from "../../utils/parsePresent";

export const transformObInsitu = (row: string[]) => {
    const plan = parseNum(row[9]);
    const actual = parseNum(row[10]);
    const volume = parseNum(row[11]);
    const ach = parsePrecent(row[12]);
    const reason = row[13]?.trim() || undefined;

    if (plan === null && actual === null && volume === null && ach === null) {
        return null;
    }

    return {
        unit: "M3/JAM",
        plan,
        actual,
        volume,
        ach,
        reason
    };
};