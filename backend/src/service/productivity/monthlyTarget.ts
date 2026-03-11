import { DailyOperation } from "../../model/monthly.model";
import { getMonthDateRange, getMonthName } from "../../utils/data";
import { Params } from "../../interface/productivity/monthlyActualType";

interface ActivityAccumulator {
  plan: number;
  actual: number;
  dailyActuals: number[];
}

export async function getMonthlyTargetService(params: Params) {
  const { site, year, month } = params;

  if (!site || !year || !month) {
    throw new Error("Missing required parameters");
  }

  const yearNum = Number(year);
  const monthNum = Number(month);

  if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
    throw new Error("Year or month must be a number");
  }

  if (monthNum < 1 || monthNum > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  const { startDate, endDate } = getMonthDateRange(yearNum, monthNum);

  const records = await DailyOperation.find({
    site,
    date: { $gte: startDate, $lte: endDate },
  })
    .select("date activities")
    .lean();

  if (records.length === 0) {
    throw new Error("DATA_NOT_FOUND");
  }

  let totalPlan = 0;
  let totalActual = 0;

  const activityBreakdown: Record<string, ActivityAccumulator> = {};

  for (const doc of records) {
    const activities = (doc.activities ?? {}) as Record<string, any>;
    for (const [name, activity] of Object.entries(activities)) {
      const plan = activity.plan || 0;
      const actual = activity.actual || 0;

      totalPlan += plan;
      totalActual += actual;

      activityBreakdown[name] ??= { plan: 0, actual: 0, dailyActuals: [] };
      activityBreakdown[name].plan += plan;
      activityBreakdown[name].actual += actual;
      activityBreakdown[name].dailyActuals.push(actual);
    }
  }

  const dailyTotals: number[] = [];
  for (const doc of records) {
    const activities = (doc.activities ?? {}) as Record<string, any>;
    let dayTotal = 0;
    for (const activity of Object.values(activities)) {
      dayTotal += activity.actual || 0;
    }
    dailyTotals.push(dayTotal);
  }

  const averageDaily =
    dailyTotals.length > 0
      ? dailyTotals.reduce((sum, val) => sum + val, 0) / dailyTotals.length
      : 0;

  const maxDaily = dailyTotals.length > 0 ? Math.max(...dailyTotals) : 0;

  // ✅ Filter zero untuk min agar hari tidak operasi tidak dihitung
  const nonZeroDailyTotals = dailyTotals.filter(val => val > 0);
  const minDaily = nonZeroDailyTotals.length > 0 ? Math.min(...nonZeroDailyTotals) : 0;

  const percentage = totalPlan > 0 ? (totalActual / totalPlan) * 100 : 0;

  return {
    site,
    year: yearNum,
    month: getMonthName(monthNum),
    totalPlan: Number(totalPlan.toFixed(2)),
    averageDaily: Number(averageDaily.toFixed(2)),
    maxDaily: Number(maxDaily.toFixed(2)),
    minDaily: Number(minDaily.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
    deviation: Number((percentage - 100).toFixed(2)),
    activityBreakdown: Object.fromEntries(
      Object.entries(activityBreakdown).map(([k, v]: [string, ActivityAccumulator]) => {
        const activityAverage =
          v.dailyActuals.length > 0
            ? v.dailyActuals.reduce((sum, val) => sum + val, 0) / v.dailyActuals.length
            : 0;

        const activityMax = v.dailyActuals.length > 0 ? Math.max(...v.dailyActuals) : 0;

        // ✅ Filter zero untuk min per activity
        const nonZeroActuals = v.dailyActuals.filter(val => val > 0);
        const activityMin = nonZeroActuals.length > 0 ? Math.min(...nonZeroActuals) : 0;

        return [
          k,
          {
            plan: Number(v.plan.toFixed(2)),
            average: Number(activityAverage.toFixed(2)),
            max: Number(activityMax.toFixed(2)),
            min: Number(activityMin.toFixed(2)),
            percentage:
              v.plan > 0 ? Number(((v.actual / v.plan) * 100).toFixed(2)) : 0,
          },
        ];
      })
    ),
  };
}