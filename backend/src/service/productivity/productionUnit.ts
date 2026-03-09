import { ProductionUnit } from "../../interface/productivity/unitProductionType";
import { ProductionUnits } from "../../model/produktivityUnit";

export const upsertProductionUnits = async (data: ProductionUnit): Promise<void> => {
  const operations: any[] = [];

  for (const [activityName, activityArray] of data.activities.entries()) {
    for (const activity of activityArray) {
      operations.push({
        updateOne: {
          filter: {
            date: data.date,
            site: data.site,
            activity: activityName,
            unit: activity.unit
          },
          update: {
            $set: {
              date: data.date,
              site: data.site,
              activity: activityName,
              unit: activity.unit,
              plan: activity.plan,
              pa: activity.pa,
              ua: activity.ua,
              ma: activity.ma,
              eu: activity.eu,
              produktivityIndex: activity.productivityIndex
            }
          },
          upsert: true
        }
      });
    }
  }

  if (operations.length === 0) return;

  await ProductionUnits.bulkWrite(operations);
};