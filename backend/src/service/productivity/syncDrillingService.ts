import { upsertProductionUnits } from "./productionUnit";
import { ProductionUnit, Activity } from "../../interface/productivity/unitProductionType";
import mongoose from "mongoose";

interface DrillingUnitData {
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
}

export const syncDrillingService = async (data: DrillingUnitData) => {
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
      productivityIndex: {
        lbgJam: 0,
        mtrJam: 0,
        ltrMtr: 0,
      },
    };

    const activitiesMap = new Map<string, Activity[]>();
    activitiesMap.set("DRILLING", [activity]);

    const prodUnitData: ProductionUnit = {
      date: data.date,
      site: data.site,
      day: data.day,
      activities: activitiesMap,
    };

    await upsertProductionUnits(prodUnitData);

    return { action: "insert" };
  } catch (error) {
    // console.error(`[SERVICE] syncDrillingService Error:`, error);
    throw error;
  }
};