import { transformDailyOperation } from "../utils/transformMonthlyPlan";
import { syncDailyOperationService } from "../service/productivity/syncMonthlyPlan.service";
import { getDataGoogle } from "../config/googleCredentials";

export const syncDailyOperationJob = async () => {
  console.log("[JOB] Start Daily Operation Job");

  try {
    // Ambil data dari Google Sheets
    const rows = await getDataGoogle(); // Sesuaikan range jika perlu
    console.log("[JOB] rows length:", rows.length);

    // Transform data
    const dailyOps = transformDailyOperation(rows, "JAN");
    console.log("[JOB] transformed:", dailyOps.length);

    // Sync ke database
    for (const op of dailyOps) {
      console.log("[JOB] syncing:", op.date);
      await syncDailyOperationService(op);
    }

    console.log("[JOB] Finish Daily Operation Job");
  } catch (error) {
    console.error("[JOB] Failed:", error);
    throw error;
  }
};