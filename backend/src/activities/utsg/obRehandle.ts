import { parseNum } from "../../utils/parseNum";
import { parsePrecent } from "../../utils/parsePresent";

export const transformObRehandle = (row: string[]) => {
    const plan = parseNum(row[4]);
    const actual = parseNum(row[5]);
    const volume = parseNum(row[6]);
    const ach = parsePrecent(row[7]);
    const reason = row[8]?.trim() || undefined;

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