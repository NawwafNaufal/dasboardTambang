import { parseNum } from "../../utils/parseNum";

export const transformLoadingHaulingPadang = (row: string[]) => {
  console.log(`    [transformLoadingHaulingPadang] Input row:`, row.slice(0, 8));
  
  const plan = parseNum(row[4]);
  const actual = parseNum(row[5]);
  const rkap = parseNum(row[6]);
  const reason = row[7]?.trim() || undefined;
  
  const result = {
    unit: "ton",
    plan,
    actual,
    rkap,
    reason,
  };
  
  console.log(`    [transformLoadingHaulingPadang] Final result:`, result);
  
  return result;
};