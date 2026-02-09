import { transformDailyOperation } from "../utils/transformMonthlyPlan";
import { syncDailyOperationService } from "../service/productivity/syncMonthlyPlan.service";
import { getAllSpreadsheetsData } from "../config/googleCredentials";

export const syncDailyOperationJob = async () => {
  console.log("[JOB] Start Daily Operation Job"); // ← UNCOMMENT
  
  try {
    // Ambil data dari semua spreadsheet dengan info site
    const allSpreadsheets = await getAllSpreadsheetsData();
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    let totalRecords = 0;
    
    // Proses tiap spreadsheet (tiap site)
    for (const { spreadsheetId, site, data, success } of allSpreadsheets) {
      if (!success) {
        console.log(`[JOB] Skipping failed spreadsheet: ${site}`); // ← UNCOMMENT
        continue;
      }
      
      console.log(`[JOB] Processing ${site}: ${data.length} rows`); // ← UNCOMMENT
      
      // Transform dengan site yang sesuai
      const dailyOps = transformDailyOperation(data, site);
      
      console.log(`[JOB] ${site} - Transformed records:`, dailyOps.length); // ← UNCOMMENT
      totalRecords += dailyOps.length;
      
      // Sync ke database
      for (const op of dailyOps) {
        try {
          const result = await syncDailyOperationService(op);
          if (result.action === "insert") inserted++;
          if (result.action === "update") updated++;
        } catch (error) {
          console.error(`[JOB] Error syncing ${site} - ${op.date}:`, error); // ← UNCOMMENT
          errors++;
        }
      }
      
      console.log(`[JOB] ${site} - Done processing`); // ← UNCOMMENT
    }
    
    console.log(`[JOB] Complete Summary:`); // ← UNCOMMENT
    console.log(`  - Total records: ${totalRecords}`); // ← UNCOMMENT
    console.log(`  - Inserted: ${inserted}`); // ← UNCOMMENT
    console.log(`  - Updated: ${updated}`); // ← UNCOMMENT
    console.log(`  - Errors: ${errors}`); // ← UNCOMMENT
    
  } catch (error) {
    console.error("[JOB] Fatal error:", error); // ← UNCOMMENT
    throw error;
  }
};