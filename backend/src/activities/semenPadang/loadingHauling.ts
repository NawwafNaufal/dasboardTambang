import { parseNum } from "../../utils/parseNum";

export const transformLoadingHaulingPadang = (row: string[]) => {
  
  const plan = parseNum(row[4], true);
  const actual = parseNum(row[5], true);
  const rkap = parseNum(row[6], true);
  const reason = row[7]?.trim() || undefined;

  const result = {
    unit: "ton",
    plan,
    actual,
    rkap,
    reason,
  };
  
  
  return result;
};