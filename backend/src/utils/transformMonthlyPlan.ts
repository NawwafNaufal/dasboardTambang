import { DailyOperationData } from "../interface/productivity/dailyProductionType";
import { convertDateFormat } from "./convertDate";
import { isHeaderRow } from "../utils/parseNum";

// PT Semen Tonasa
import { transformLoadingHauling } from "../activities/Tonasa/loadingHauling";
import { transformDrilling } from "../activities/Tonasa/drilling";
import { transformPerintisanUsed } from "../activities/Tonasa/perintisanUsed";
import { transformPerintisanNew } from "../activities/Tonasa/perintisanNew";
import { transformBulldozerUsed } from "../activities/Tonasa/bulldozerUsed";
import { transformBulldozerNew } from "../activities/Tonasa/bulldozerNew";
import { transformBreaker } from "../activities/Tonasa/breaker";

// UTSG
import { transformObRehandle } from "../activities/utsg/obRehandle";
import { transformObInsitu } from "../activities/utsg/obInstitu";
import { transformEr } from "../activities/utsg/er";
import { transformPpoDirect } from "../activities/utsg/ppoDirect";

// Lamongan Shorebase
import { transformStock } from "../activities/lamonganShorbase/stock";
import { transformCotonFields } from "../activities/lamonganShorbase/cotonFields";

// PT Semen Padang
import { transformLoadingHaulingPadang } from "../activities/semenPadang/loadingHauling";

export const transformDailyOperation = (rows: string[][], site: string) => {
  const result: DailyOperationData[] = [];

  // Logging khusus untuk PT Semen Padang
  if (site === "PT Semen Padang") {
    // console.log(`\n========== TRANSFORM PT SEMEN PADANG ==========`);
    // console.log(`[TRANSFORM] Total rows to process: ${rows.length}`);
  }

  let rowsProcessed = 0;
  let rowsSkipped = 0;
  const skipReasons: Record<string, number> = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Check 1: Row valid
    if (!row || row.length < 7) {
      if (site === "PT Semen Padang") {
        // console.log(`[SKIP-${i}] Length < 7 (actual: ${row?.length})`);
      }
      rowsSkipped++;
      skipReasons["length < 7"] = (skipReasons["length < 7"] || 0) + 1;
      continue;
    }
    
    // Check 2: Is header
    const isHeader = isHeaderRow(row);
    if (isHeader) {
      if (site === "PT Semen Padang") {
        // console.log(`[SKIP-${i}] Header row:`, row.slice(0, 8));
      }
      rowsSkipped++;
      skipReasons["header"] = (skipReasons["header"] || 0) + 1;
      continue;
    }

    // Check 3: Has tanggal
    const tanggal = row[2]?.trim();
    const hari = row[3]?.trim();
    
    if (site === "PT Semen Padang") {
      // console.log(`\n[ROW-${i}] Processing...`);
      // console.log(`  - Tanggal (row[2]): "${tanggal}"`);
      // console.log(`  - Hari (row[3]): "${hari}"`);
    }
    
    if (!tanggal) {
      if (site === "PT Semen Padang") {
        // console.log(`[SKIP-${i}] No tanggal`);
      }
      rowsSkipped++;
      skipReasons["no tanggal"] = (skipReasons["no tanggal"] || 0) + 1;
      continue;
    }

    // Check 4: Convert date
    const dateFormatted = convertDateFormat(tanggal);
    
    if (site === "PT Semen Padang") {
      // console.log(`  - Date formatted: "${dateFormatted}"`);
    }
    
    if (!dateFormatted) {
      if (site === "PT Semen Padang") {
        // console.log(`[SKIP-${i}] Invalid date format`);
      }
      rowsSkipped++;
      skipReasons["invalid date"] = (skipReasons["invalid date"] || 0) + 1;
      continue;
    }

    const activities: DailyOperationData["activities"] = {};

    // Transform berdasarkan site
    if (site === "Lamongan Shorebase") {
      const cotonFields = transformCotonFields(row);
      if (cotonFields) activities["coton_fields"] = cotonFields;

      const stock = transformStock(row);
      if (stock) activities["stock"] = stock;

    } else if (site === "PT Semen Tonasa") {
      activities["loading_hauling"] = transformLoadingHauling(row);

      const drilling = transformDrilling(row);
      if (drilling) activities["drilling"] = drilling;

      const perintisanUsed = transformPerintisanUsed(row);
      if (perintisanUsed) activities["perintisan_used"] = perintisanUsed;

      const perintisanNew = transformPerintisanNew(row);
      if (perintisanNew) activities["perintisan_new"] = perintisanNew;

      const bulldozerUsed = transformBulldozerUsed(row);
      if (bulldozerUsed) activities["bulldozer_used"] = bulldozerUsed;

      const bulldozerNew = transformBulldozerNew(row);
      if (bulldozerNew) activities["bulldozer_new"] = bulldozerNew;

      const breaker = transformBreaker(row);
      if (breaker) activities["breaker"] = breaker;

    } else if (site === "UTSG") {
      const obRehandle = transformObRehandle(row);
      if (obRehandle) activities["ob_rehandle"] = obRehandle;

      const obInsitu = transformObInsitu(row);
      if (obInsitu) activities["ob_insitu"] = obInsitu;

      const er = transformEr(row);
      if (er) activities["er"] = er;

      const ppoDirect = transformPpoDirect(row);
      if (ppoDirect) activities["ppo_direct"] = ppoDirect;

    } else if (site === "PT Semen Padang") {
      console.log(`  - Transforming loading_hauling...`);
      const loadingHauling = transformLoadingHaulingPadang(row);
      activities["loading_hauling"] = loadingHauling;
      console.log(`  - Result:`, loadingHauling);
    }

    const record: DailyOperationData = {
      date: dateFormatted,
      site,
      day: hari,
      activities,
    };

    if (site === "PT Semen Padang") {
      // console.log(`[ROW-${i}] ✅ Record created:`, JSON.stringify(record, null, 2));
    }

    result.push(record);
    rowsProcessed++;
  }

  if (site === "PT Semen Padang") {
    // console.log(`\n========== TRANSFORM SUMMARY ==========`);
    // console.log(`Total rows: ${rows.length}`);
    // console.log(`Processed: ${rowsProcessed}`);
    // console.log(`Skipped: ${rowsSkipped}`);
    // console.log(`Skip reasons:`, skipReasons);
    // console.log(`Result length: ${result.length}`);
    // console.log(`=======================================\n`);
  }

  return result;
};