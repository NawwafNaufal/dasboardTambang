import { DailyOperationData } from "../../utils/transformMonthlyPlan";
import { DailyOperation } from "../../model/produktivity/daily.model";
import mongoose from "mongoose";

export const syncDailyOperationService = async (data: DailyOperationData) => {
  console.log(`[SERVICE] sync daily`, data.date, data.site);

  // Validasi koneksi DB
  if (mongoose.connection.readyState !== 1) {
    console.error("[SERVICE] ❌ MongoDB not connected!");
    throw new Error("Database not connected");
  }

  try {
    const existing = await DailyOperation.findOne({
      date: data.date,
      site: data.site
    });

    if (!existing) {
      const created = await DailyOperation.create(data);
      console.log(`[DB] INSERT`, created._id.toString());
      return { action: "insert", id: created._id };
    }

    // Compare data untuk avoid unnecessary update
    const existingJson = JSON.stringify({
      day: existing.day,
      plan: existing.plan,
      actual: existing.actual,
      rkap: existing.rkap,
      activities: existing.activities
    });

    const newJson = JSON.stringify({
      day: data.day,
      plan: data.plan,
      actual: data.actual,
      rkap: data.rkap,
      activities: data.activities
    });

    if (existingJson === newJson) {
      console.log(`[DB] SKIP (no changes)`);
      return { action: "skip" };
    }

    const result = await DailyOperation.updateOne(
      { date: data.date, site: data.site },
      { $set: data }
    );

    console.log(`[DB] UPDATE`, result.modifiedCount);
    return { action: "update", modifiedCount: result.modifiedCount };

  } catch (error) {
    console.error(`[SERVICE] Error:`, error);
    throw error;
  }
};