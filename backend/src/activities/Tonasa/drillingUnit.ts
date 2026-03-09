import { parseNum } from "../../utils/parseNum";

export const transformDrilling = (row: string[]) => {

  const units = [
    { name: "HCR-07", start: 5 },
    { name: "EPIROC-01", start: 19 },
    { name: "EPIROC-02", start: 33 },
    { name: "PCR-01", start: 47 },
    { name: "PCR-02", start: 61 },
    { name: "PCR-03", start: 75 },
  ];

  const results = [];
  const plan = parseNum(row[4]);

  for (const unit of units) {

    const base = unit.start;

    const pa = parseNum(row[base + 6]);
    const ua = parseNum(row[base + 7]);
    const ma = parseNum(row[base + 8]);
    const eu = parseNum(row[base + 9]);

    const productivityIndex = {
      lbgJam: parseNum(row[base + 3]),
      mtrJam: parseNum(row[base + 4]),
      ltrJam: parseNum(row[base + 5]),
    };

    if (pa === null && ua === null && ma === null && eu === null) {
      continue;
    }

    results.push({
      unit: unit.name,
      plan,
      pa,
      ua,
      ma,
      eu,
      productivityIndex
    });
  }

  return results;
};