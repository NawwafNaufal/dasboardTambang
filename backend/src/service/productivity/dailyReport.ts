import { DailyOperation } from "../../model/monthly.model";
import { getMonthName } from "../../utils/data";
import { MonthlyActualResult } from "../../interface/productivity/monthlyActualType";

export const getMonthlyActualBySiteService = async (year: number): Promise<MonthlyActualResult> => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const records = await DailyOperation.find({
    date: { $gte: startDate, $lte: endDate }
  })
    .select("site date activities")
    .lean();

  const grouped: Record<string, Record<string, Record<string, number>>> = {};

  for (const doc of records) {
    const site = doc.site;
    const month = doc.date.slice(5, 7);

    grouped[site] ??= {};

    if (!doc.activities) continue;

    for (const [key, activity] of Object.entries(doc.activities)) {
      const activityName = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());

      grouped[site][activityName] ??= {};
      grouped[site][activityName][month] ??= 0;

      grouped[site][activityName][month] += activity?.actual ?? 0;
    }
  }

  const result: MonthlyActualResult = {};

  for (const site of Object.keys(grouped)) {
    result[site] = {};

    for (const activity of Object.keys(grouped[site])) {
      result[site][activity] = [];

      for (let i = 1; i <= 12; i++) {
        const monthKey = String(i).padStart(2, "0");

        result[site][activity].push({
          month: getMonthName(i),
          value: Math.round(grouped[site][activity][monthKey] ?? 0),
        });
      }
    }
  }

  return result;
};
