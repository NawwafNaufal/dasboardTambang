import { transformDailyOperation } from "../utils/transformMonthlyPlan";
import { syncDailyOperationService } from "../service/productivity/syncMonthlyPlan.service";
import { getDataGoogle } from "../config/googleCredentials";

export const syncDailyOperationJob = async () => {
  console.log("[JOB] Start Daily Operation Job");

  try {
    const rows = await getDataGoogle();
    console.log("[JOB] Rows from Google:", rows.length);

    const dailyOps = transformDailyOperation(rows);
    console.log("[JOB] Transformed records:", dailyOps.length);

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const op of dailyOps) {
      try {
        const result = await syncDailyOperationService(op);
        if (result.action === "insert") inserted++;
        if (result.action === "update") updated++;
      } catch (error) {
        console.error(`[JOB] Error syncing ${op.date}:`, error);
        errors++;
      }
    }

    console.log(`[JOB] Complete: ${inserted} inserted, ${updated} updated, ${errors} errors`);
  } catch (error) {
    console.error("[JOB] Fatal error:", error);
    throw error;
  }
};