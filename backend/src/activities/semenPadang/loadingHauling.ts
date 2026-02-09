import { parseNum } from "../../utils/parseNum";

export const transformLoadingHaulingPadang = (row: string[]) => {
  console.log(`    [transformLoadingHaulingPadang] Input row:`, row.slice(0, 8));
  
  const plan = parseNum(row[4]);
  const actual = parseNum(row[5]);
  const rkap = parseNum(row[6]);
  const reason = row[7]?.trim() || undefined;
  
  console.log(`    [transformLoadingHaulingPadang] Parsed values:`);
  console.log(`      - plan (row[4]): ${row[4]} → ${plan}`);
  console.log(`      - actual (row[5]): ${row[5]} → ${actual}`);
  console.log(`      - rkap (row[6]): ${row[6]} → ${rkap}`);
  console.log(`      - reason (row[7]): ${row[7]} → ${reason}`);
  
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