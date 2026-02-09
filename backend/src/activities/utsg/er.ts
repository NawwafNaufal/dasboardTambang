import { parseNum } from "../../utils/parseNum";
import { parsePrecent } from "../../utils/parsePresent";

export const transformEr = (row: string[]) => {
    const plan = parseNum(row[14]);
    const actual = parseNum(row[15]);
    const volume = parseNum(row[16]);
    const ach = parsePrecent(row[17]);
    const reason = row[18]?.trim() || undefined;

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