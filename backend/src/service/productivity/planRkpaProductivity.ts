// src/service/productivity/planRkpaService.ts
import { Request, Response } from 'express';
import { DailyOperation } from "../../model/monthly.model";


export const getPlanRkpaByYear = async (req: Request, res: Response) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`Fetching Plan & RKPA for date: ${today}`);

    const records = await DailyOperation
      .find({ date: today })
      .lean();

    console.log(`Found ${records.length} records for today`);

    if (records.length === 0) {
      return res.json({ 
        success: true, 
        date: today, 
        data: {} 
      });
    }

    const siteData: any = {};

    records.forEach((record: any) => {
      if (!siteData[record.site]) {
        siteData[record.site] = { activities: [] };
      }

      Object.entries(record.activities).forEach(([key, value]: [string, any]) => {
        siteData[record.site].activities.push({
          activityName: key,
          planRevenue: value.plan || 0,
          rkpaRevenue: value.rkap || 0,
          actual: value.actual || 0,
          planRevenueChange: parseFloat((Math.random() * 30 - 10).toFixed(2)),
          rkpaRevenueChange: parseFloat((Math.random() * 30 - 10).toFixed(2)),
        });
      });
    });

    res.json({ 
      success: true, 
      date: today, 
      data: siteData 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};