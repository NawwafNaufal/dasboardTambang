import { DailyOperation } from "../../model/monthly.model";
import { getMonthName } from "../../utils/data";
import { MonthlyActualResult } from "../../interface/productivity/monthlyActualType";
import Decimal from "decimal.js";
import { parseNum } from "../../utils/parseNum";

const parseActual = (actual: string | number | undefined): Decimal => {
  let num = 0;

  if (typeof actual === "number") {
    num = actual;
  } else if (typeof actual === "string") {
    num = parseNum(actual) ?? 0;
  }

  return new Decimal(num);
};

export const getMonthlyActualBySiteService = async (
  year: number
): Promise<MonthlyActualResult> => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const records = await DailyOperation.find({
    date: { $gte: startDate, $lte: endDate }
  })
    .select("site date activities")
    .lean();

  const grouped: Record<string, Record<string, Record<string, Decimal>>> = {};

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
      grouped[site][activityName][month] ??= new Decimal(0);

      grouped[site][activityName][month] =
        grouped[site][activityName][month].plus(
          parseActual(activity?.actual)
        );
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
          value: grouped[site][activity][monthKey]
            ? grouped[site][activity][monthKey]
                .toDecimalPlaces(2)
                .toNumber()
            : 0
        });
      }
    }
  }

  return result;
};