import { parseNum } from "../../utils/parseNum";
import { parsePrecent } from "../../utils/parsePresent";

export const transformPpoDirect = (row: string[]) => {
    const plan = parseNum(row[19]);
    const actual = parseNum(row[20]);
    const volume = parseNum(row[21]);
    const ach = parsePrecent(row[22]);
    const reason = row[23]?.trim() || undefined;

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