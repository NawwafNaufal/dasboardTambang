import { transformDailyOperation } from "../utils/transformMonthlyPlan";
import { transformMultiUnitActivity } from "../utils/transformUnit";
import { syncDailyOperationService } from "../service/productivity/monthlyPlan";
import { syncDrillingService } from "../service/productivity/syncDrillingService";
import { getAllSpreadsheetsData } from "../service/googleSheets/spreadSheet";
import { syncLoadingService } from "../service/productivity/syncLoadingService";
import { syncHaulingService } from "../service/productivity/syncHaulingService";
import { syncSupportingService } from "../service/productivity/syncSupportingService";
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
    // ─── 2. SHEET DRILLING ─────────────────────────────────────
const drillingSheets = await getAllSpreadsheetsData("DRILLING");

for (const { site, data, success } of drillingSheets) {
  if (!success) {
    logger.warn(`[JOB] Skipping failed spreadsheet (DRILLING): ${site}`);
    continue;
  }

  // ✅ kirim semua rows sekaligus
  const results = transformMultiUnitActivity(data as string[][]);
  totalRecords += results.length;

  for (const { date, day, units } of results) {
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

// ─── 3. SHEET LOADING ──────────────────────────────────────
logger.info("[JOB] Waiting 10s before fetching LOADING...");
await new Promise(resolve => setTimeout(resolve, 10000));
const loadingSheets = await getAllSpreadsheetsData("LOADING");

for (const { site, data, success } of loadingSheets) {
  if (!success) {
    logger.warn(`[JOB] Skipping failed spreadsheet (LOADING): ${site}`);
    continue;
  }
  const results = transformMultiUnitActivity(data as string[][]);
  totalRecords += results.length;
  for (const { date, day, units } of results) {
    for (const unit of units) {
      try {
        const res = await syncLoadingService({ site, date, day, ...unit });
        if (res.action === "insert") inserted++;
        if (res.action === "update") updated++;
      } catch (error: any) {
        logger.error(`[JOB] Error syncing LOADING ${site} - ${date}`, {
          message: error.message,
          stack: error.stack,
        });
        errors++;
      }
    }
  }
}

// ─── 4. SHEET HAULING ──────────────────────────────────────
logger.info("[JOB] Waiting 10s before fetching HAULING...");
await new Promise(resolve => setTimeout(resolve, 10000));
const haulingSheets = await getAllSpreadsheetsData("HAULING");

for (const { site, data, success } of haulingSheets) {
  if (!success) {
    logger.warn(`[JOB] Skipping failed spreadsheet (HAULING): ${site}`);
    continue;
  }
  const results = transformMultiUnitActivity(data as string[][]);
  totalRecords += results.length;
  for (const { date, day, units } of results) {
    for (const unit of units) {
      try {
        const res = await syncHaulingService({ site, date, day, ...unit });
        if (res.action === "insert") inserted++;
        if (res.action === "update") updated++;
      } catch (error: any) {
        logger.error(`[JOB] Error syncing HAULING ${site} - ${date}`, {
          message: error.message,
          stack: error.stack,
        });
        errors++;
      }
    }
  }
}

// ─── 5. SHEET SUPPORTING ───────────────────────────────────
logger.info("[JOB] Waiting 10s before fetching SUPPORTING...");
await new Promise(resolve => setTimeout(resolve, 10000));
const supportingSheets = await getAllSpreadsheetsData("SUPPORTING");

for (const { site, data, success } of supportingSheets) {
  if (!success) {
    logger.warn(`[JOB] Skipping failed spreadsheet (SUPPORTING): ${site}`);
    continue;
  }
  const results = transformMultiUnitActivity(data as string[][]);
  totalRecords += results.length;
  for (const { date, day, units } of results) {
    for (const unit of units) {
      try {
        const res = await syncSupportingService({ site, date, day, ...unit });
        if (res.action === "insert") inserted++;
        if (res.action === "update") updated++;
      } catch (error: any) {
        logger.error(`[JOB] Error syncing SUPPORTING ${site} - ${date}`, {
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