import { DailyOperationData } from "../interface/productivity/dailyProductionType";
import { convertDateFormat } from "./convertDate";
import { isHeaderRow } from "../utils/parseNum";
import { transformLoadingHauling } from "../activities/Tonasa/loadingHauling";
import { transformDrilling } from "../activities/Tonasa/drilling";
import { transformPerintisanUsed } from "../activities/Tonasa/perintisanUsed";
import { transformPerintisanNew } from "../activities/Tonasa/perintisanNew";
import { transformBulldozerUsed } from "../activities/Tonasa/bulldozerUsed";
import { transformBulldozerNew } from "../activities/Tonasa/bulldozerNew";
import { transformBreaker } from "../activities/Tonasa/breaker";
import { transformObRehandle } from "../activities/utsg/obRehandle";

import { transformCotonFields } from "../activities/lamonganShorbase/cotonFields";

// Tambahkan parameter site
export const transformDailyOperation = (rows: string[][], site: string) => {
  const result: DailyOperationData[] = [];

  for (const row of rows) {
    if (!row || row.length < 11) continue;
    if (isHeaderRow(row)) continue; 

    const tanggal = row[2]?.trim();
    const hari = row[3]?.trim();
    if (!tanggal) continue;

    const dateFormatted = convertDateFormat(tanggal);
    if (!dateFormatted) continue;

    const activities: DailyOperationData["activities"] = {};

    // Pilih transform function berdasarkan site
    if (site === "Lamongan Shorebase") {
      // Untuk Lamongan Shorebase
      const cotonFields = transformCotonFields(row);
      if (cotonFields) activities["coton_fields"] = cotonFields;
      
    } else if (site === "PT Semen Tonasa") {
      // Untuk PT Semen Tonasa - SEMUA activities
      
      // Loading & Hauling (wajib)
      activities["loading_hauling"] = transformLoadingHauling(row);

      // Drilling (optional)
      const drilling = transformDrilling(row);
      if (drilling) activities["drilling"] = drilling;

      // Perintisan Used (optional)
      const perintisanUsed = transformPerintisanUsed(row);
      if (perintisanUsed) activities["perintisan_used"] = perintisanUsed;

      // Perintisan New (optional)
      const perintisanNew = transformPerintisanNew(row);
      if (perintisanNew) activities["perintisan_new"] = perintisanNew;

      // Bulldozer Used (optional)
      const bulldozerUsed = transformBulldozerUsed(row);
      if (bulldozerUsed) activities["bulldozer_used"] = bulldozerUsed;

      // Bulldozer New (optional)
      const bulldozerNew = transformBulldozerNew(row);
      if (bulldozerNew) activities["bulldozer_new"] = bulldozerNew;

      // Breaker (optional)
      const breaker = transformBreaker(row);
      if (breaker) activities["breaker"] = breaker;
    } else if (site === "UTSG" ) {
      const obRehandle = transformObRehandle(row);
        if (obRehandle) activities["ob_rehandle"] = obRehandle
    }

    result.push({
      date: dateFormatted,
      site,
      day: hari,
      activities,
    });
  }

  const byMonth = result.reduce((acc, item) => {
    const month = item.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`[TRANSFORM] ${site} - Total:`, result.length);
  console.log(`[TRANSFORM] ${site} - Per month:`, byMonth);

  return result;
};