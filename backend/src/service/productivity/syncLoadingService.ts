import { upsertProductionUnits } from "./productionUnit";
import { ProductionUnit, Activity } from "../../interface/productivity/unitProductionType";
import mongoose from "mongoose";

interface LoadingUnitData {
  site: string;
  date: string;
  day?: string;
  unit: string;
  fuel?: number;
  pa: number;
  ua: number;
  ma: number;
  eu: number;
  plan?: number;
  produktivityIndex?: { // ← TAMBAH
    lbgJam: number;
    mtrJam: number;
    ltrMtr: number;
  };
}

export const syncLoadingService = async (data: LoadingUnitData) => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }

  try {
    const activity: Activity = {
      unit: data.unit,
      plan: data.plan ?? 0,
      pa: data.pa,
      ua: data.ua,
      ma: data.ma,
      eu: data.eu,
      fuel: data.fuel ?? 0,
      productivityIndex: {
        lbgJam: data.produktivityIndex?.lbgJam ?? 0, // ← FIX
        mtrJam: data.produktivityIndex?.mtrJam ?? 0, // ← FIX
        ltrMtr: data.produktivityIndex?.ltrMtr ?? 0, // ← FIX
      },
    };

    const activitiesMap = new Map<string, Activity[]>();
    activitiesMap.set("LOADING", [activity]);

    const prodUnitData: ProductionUnit = {
      date: data.date,
      site: data.site,
      day: data.day,
      activities: activitiesMap,
    };

    await upsertProductionUnits(prodUnitData);

    return { action: "insert" };
  } catch (error) {
    console.error(`[SERVICE] syncDrillingService Error:`, error);
    throw error;
  }
};