import { DailyOperationData } from "../../interface/productivity/dailyProductionType";
import { DailyOperation } from "../../model/monthly.model";
import mongoose from "mongoose";

export const syncDailyOperationService = async (data: DailyOperationData) => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }

  try {
    const result = await DailyOperation.replaceOne(
      { date: data.date, site: data.site },
      data,
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      return { action: "insert", upsertedId: result.upsertedId };
    } else if (result.modifiedCount > 0) {
      return { action: "update", modifiedCount: result.modifiedCount };
    } else {
      return { action: "skip" };
    }
  } catch (error) {
    console.error(`[SERVICE] Error:`, error);
    throw error;
  }
};