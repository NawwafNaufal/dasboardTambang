import { DailyOperation } from "../../model/monthly.model";
import { getMonthName } from "../../utils/data";
import { StatisticsParams } from "../../interface/productivity/monthlyActualType";

export const getStatisticsByMonthService = async ({site,month,year}: StatisticsParams) => {

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

  const records = await DailyOperation.find({
    site,
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: 1 })
    .select("date day activities")
    .lean();

  const activityData: Record<string, any> = {};

  for (const record of records) {
    const day = Number(record.date.slice(8, 10));
    const dayName = record.day ?? "";

    if (!record.activities) continue;

    for (const [activityKey, activity] of Object.entries(record.activities)) {
      activityData[activityKey] ??= {
        activityName: activityKey,
        plan: activity.plan ?? 0,
        unit: activity.unit ?? "",
        dailyData: [],
        notes: [],
        breakdownDetails: [],
      };

      activityData[activityKey].dailyData.push({
        day,
        dayName,
        date: record.date,
        actual: activity.actual ?? 0,
        plan: activity.plan ?? 0,
        rkap: activity.rkap ?? 0,
        ach: activity.ach ?? 0,
        reason: activity.reason ?? null,
      });

      if (activity.reason) {
        activityData[activityKey].notes.push({
          day,
          dayName,
          date: record.date,
          reason: activity.reason,
        });
      }

      if (activity.breakdown) {
        const units = Object.entries(activity.breakdown).map(
          ([unitName, value]: [string, any]) =>
            typeof value === "number"
              ? { unitName, actual: value, unit: activity.unit }
              : {
                  unitName,
                  plan: value.plan ?? 0,
                  actual: value.actual ?? 0,
                  unit: value.unit ?? activity.unit,
                }
        );

        if (units.length) {
          activityData[activityKey].breakdownDetails.push({
            day,
            dayName,
            date: record.date,
            units,
          });
        }
      }
    }
  }

  return {
    site,
    month,
    monthName: getMonthName(month),
    year,
    data: activityData,
  };
};
