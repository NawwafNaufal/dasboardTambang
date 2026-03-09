import { transformDailyOperation } from "../utils/transformMonthlyPlan";
import { transformMultiUnitActivity } from "../utils/transformUnit";
import { syncDailyOperationService } from "../service/productivity/monthlyPlan";
import { syncDrillingService } from "../service/productivity/syncDrillingService";
import { getAllSpreadsheetsData } from "../service/googleSheets/spreadSheet";
import { logger } from "../log/winston";

export const syncDailyOperationJob = async () => {
  // logger.info("[JOB] Start Daily Operation Job");

  try {
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    let totalRecords = 0;

    // ─── 1. SHEET1 (Daily Operation) ───────────────────────────
    const allSpreadsheets = await getAllSpreadsheetsData("PRODUKSI");

    for (const { site, data, success } of allSpreadsheets) {
      if (!success) {
        logger.warn(`[JOB] Skipping failed spreadsheet (PRODUKSI): ${site}`);
        continue;
      }

      const dailyOps = transformDailyOperation(data, site);
      totalRecords += dailyOps.length;

      for (const op of dailyOps) {
        try {
          const result = await syncDailyOperationService(op);
          if (result.action === "insert") inserted++;
          if (result.action === "update") updated++;
        } catch (error: any) {
          logger.error(`[JOB] Error syncing PRODUKSI ${site} - ${op.date}`, {
            message: error.message,
            stack: error.stack,
          });
          errors++;
        }
      }
    }

    // tunggu 10 detik sebelum fetch DRILLING
    logger.info("[JOB] Waiting 10s before fetching DRILLING...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    // ─── 2. SHEET DRILLING ─────────────────────────────────────
    const drillingSheets = await getAllSpreadsheetsData("DRILLING");

    for (const { site, data, success } of drillingSheets) {
      if (!success) {
        logger.warn(`[JOB] Skipping failed spreadsheet (DRILLING): ${site}`);
        continue;
      }

      for (const row of data) {
        const result = transformMultiUnitActivity(row as string[]);
        if (!result) continue;

        const { date, day, units } = result;
        totalRecords += units.length;

        for (const unit of units) {
          try {
            const res = await syncDrillingService({ site, date, day, ...unit });
            if (res.action === "insert") inserted++;
            if (res.action === "update") updated++;
          } catch (error: any) {
            logger.error(`[JOB] Error syncing DRILLING ${site} - ${date}`, {
              message: error.message,
              stack: error.stack,
            });
            errors++;
          }
        }
      }
    }

    logger.info("[JOB] Daily Operation Sync Summary", {
      totalRecords,
      inserted,
      updated,
      errors,
    });

  } catch (error: any) {
    logger.error("[JOB] Fatal error in syncDailyOperationJob", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};