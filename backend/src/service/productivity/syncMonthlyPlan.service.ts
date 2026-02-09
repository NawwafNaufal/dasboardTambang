import { DailyOperationData } from "../../interface/productivity/dailyProductionType";
import { DailyOperation } from "../../model/produktivity/monthly.model";
import mongoose from "mongoose";

export const syncDailyOperationService = async (data: DailyOperationData) => {
  console.log(`[SERVICE] Syncing: ${data.date} - ${data.site}`); // ← UNCOMMENT
  
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }

  try {
    console.log("[SERVICE] Data to save:", JSON.stringify(data, null, 2)); // ← UNCOMMENT
    
    const result = await DailyOperation.replaceOne(
      { date: data.date, site: data.site },
      data,
      { upsert: true } 
    );

    if (result.upsertedCount > 0) {
      console.log(`[SERVICE] ✅ INSERTED new document`); // ← UNCOMMENT
      return { action: "insert", upsertedId: result.upsertedId };
    } else if (result.modifiedCount > 0) {
      console.log(`[SERVICE] ✅ REPLACED existing document`); // ← UNCOMMENT
      return { action: "update", modifiedCount: result.modifiedCount };
    } else {
      console.log(`[SERVICE] ⚠️ No changes (data identical)`); // ← UNCOMMENT
      return { action: "skip" };
    }
  } catch (error) {
    console.error(`[SERVICE] Error:`, error); // ← UNCOMMENT
    throw error;
  }
};