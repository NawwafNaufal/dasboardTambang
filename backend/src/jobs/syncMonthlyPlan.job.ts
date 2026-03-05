import { transformDailyOperation } from "../utils/transformMonthlyPlan";
import { syncDailyOperationService } from "../service/productivity/monthlyPlan";
import { getAllSpreadsheetsData } from "../service/googleSheets/spreadSheet";
import { logger } from "../log/winston";

export const syncDailyOperationJob = async () => {
  logger.info("[JOB] Start Daily Operation Job");
  try {
    const allSpreadsheets = await getAllSpreadsheetsData();
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    let totalRecords = 0;
    
    for (const { spreadsheetId, site, data, success } of allSpreadsheets) {
      if (!success) {
        logger.warn(`[JOB] Skipping failed spreadsheet: ${site}`)
        continue;
      }
          
      const dailyOps = transformDailyOperation(data, site);
      
      totalRecords += dailyOps.length;
      
      for (const op of dailyOps) {
        try {
          const result = await syncDailyOperationService(op);
          if (result.action === "insert") inserted++;
          if (result.action === "update") updated++;
        } catch (error : any) {
           logger.error(`[JOB] Error syncing ${site} - ${op.date}`, {
              message: error.message,
              stack: error.stack,
          });
          errors++;
        }
      }
    }
    logger.info("[JOB] Daily Operation Sync Summary", {
        totalRecords,inserted,updated,errors,
});
  } catch (error : any) {
    logger.error("[JOB] Fatal error in syncDailyOperationJob", {
        message: error.message,
        stack: error.stack,
    });
    throw error;
  }
};