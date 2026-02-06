import { DailyOperation } from "../../model/monthly.model";
import { todayISO } from "../../utils/data";
import { SiteRkpaData } from "../../interface/productivity/monthlyActualType";

export async function getPlanRkpaByTodayService() {
  const today = todayISO();

  const records = await DailyOperation.find({ date: today })
    .select("site activities")
    .lean();

  if (records.length === 0) {
    return {
      date: today,
      data: {},
    };
  }

  const siteData: Record<string, SiteRkpaData> = {};

  for (const record of records) {
    siteData[record.site] ??= { activities: [] };

    const activities = record.activities ?? {};

    for (const [key, value] of Object.entries<any>(activities)) {
      siteData[record.site].activities.push({
        activityName: key,
        planRevenue: value.plan || 0,
        rkpaRevenue: value.rkap || 0,
        actual: value.actual || 0,

        planRevenueChange: Number((Math.random() * 30 - 10).toFixed(2)),
        rkpaRevenueChange: Number((Math.random() * 30 - 10).toFixed(2)),
      });
    }
  }

  return {
    date: today,
    data: siteData,
  };
}
