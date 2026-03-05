export const transformMonthlyPlan = (rows: string[][]) => {
  // console.log("[TRANSFORM] raw rows:", rows.length);

  const [, ...dataRows] = rows;
  const map = new Map<string, any>();

  for (const row of dataRows) {
    // console.log("[TRANSFORM] row:", row);

    const [month, site, activity, plan, rkap, unit] = row;

    if (!month || !site || !activity || !unit) {
      // console.log("[TRANSFORM] skip invalid row");
      continue;
    }

    const key = `${month}_${site}`;

    if (!map.has(key)) {
      map.set(key, {
        month,
        site,
        activities: {}
      });
    }

    map.get(key)!.activities[activity] = {
      plan: Number(plan ?? 0),
      rkap: rkap ? Number(rkap) : undefined,
      unit
    };
  }

  const result = Array.from(map.values());
  // console.log("[TRANSFORM] result:", result);

  return result;
};
