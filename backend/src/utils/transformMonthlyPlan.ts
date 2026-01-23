import { DailyOperationData } from "../interface/productivity/dailyProductionType";
import { convertDateFormat } from "./convertDate";
import { isHeaderRow } from "../utils/parseNum";
import { transformLoadingHauling } from "../activities/Tonasa/loadingHauling";
import { transformDrilling } from "../activities/Tonasa/drilling";

export const transformDailyOperation = (rows: string[][]) => {
  const result: DailyOperationData[] = [];
  const site = "PT Semen Tonasa";

  for (const row of rows) {
    if (!row || row.length < 11) continue;
    if (isHeaderRow(row)) continue; 

    const tanggal = row[2]?.trim();
    const hari = row[3]?.trim();
    if (!tanggal) continue;

    const dateFormatted = convertDateFormat(tanggal);
    if (!dateFormatted) continue;

    const activities: DailyOperationData["activities"] = {};

    activities["loading_hauling"] = transformLoadingHauling(row);

    const drilling = transformDrilling(row);
    if (drilling) activities["drilling"] = drilling;

    result.push({
      date: dateFormatted,
      site,
      day: hari,
      activities,
    });
  }

  // ✅ OPSIONAL: Log summary per bulan
  const byMonth = result.reduce((acc, item) => {
    const month = item.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("[TRANSFORM] Total:", result.length);
  console.log("[TRANSFORM] Per month:", byMonth);

  return result;
};