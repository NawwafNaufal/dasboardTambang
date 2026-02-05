// src/service/productivity/statisticsService.ts
import { Request, Response } from 'express';
import { DailyOperation } from "../../model/monthly.model";

export const getStatisticsByMonth = async (req: Request, res: Response) => {
  try {
    const site = req.query.site as string || 'PT Semen Tonasa';
    const month = parseInt(req.query.month as string) || 1; // 1-12
    const year = parseInt(req.query.year as string) || 2025;

    // Get first and last day of the month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    console.log(`Fetching statistics for ${site}, ${month}/${year}`);

    const records = await DailyOperation
      .find({
        site: site,
        date: { $gte: startDate, $lte: endDate }
      })
      .sort({ date: 1 })
      .lean();

    console.log(`Found ${records.length} records`);

    if (records.length === 0) {
      return res.json({
        success: true,
        site,
        month,
        year,
        data: {}
      });
    }

    // Structure data by activity
    const activityData: any = {};

    records.forEach((record: any) => {
      const day = parseInt(record.date.split('-')[2]);
      const dayName = record.day || '';

      Object.entries(record.activities).forEach(([activityKey, activityValue]: [string, any]) => {
        if (!activityData[activityKey]) {
          activityData[activityKey] = {
            activityName: activityKey,
            plan: activityValue.plan || 0, // Plan sama semua, ambil dari record pertama
            unit: activityValue.unit || '',
            dailyData: [],
            notes: []
          };
        }

        // Add daily actual data
        activityData[activityKey].dailyData.push({
          day: day,
          dayName: dayName,
          date: record.date,
          actual: activityValue.actual || 0,
          plan: activityValue.plan || 0,
          rkap: activityValue.rkap || 0,
          ach: activityValue.ach || 0,
          reason: activityValue.reason || null,
        });

        // Add notes if there's a reason
        if (activityValue.reason) {
          activityData[activityKey].notes.push({
            day: day,
            dayName: dayName,
            date: record.date,
            reason: activityValue.reason
          });
        }

        // Add breakdown details (for units detail on hover)
        if (activityValue.breakdown && Object.keys(activityValue.breakdown).length > 0) {
          if (!activityData[activityKey].breakdownDetails) {
            activityData[activityKey].breakdownDetails = [];
          }

          const breakdownDetail: any = {
            day: day,
            dayName: dayName,
            date: record.date,
            units: []
          };

          // Extract unit details from breakdown
          // Breakdown structure: { "toppabiring": 3611, "batara": 3897, "utsg": 9650, "annur": 2051 }
          Object.entries(activityValue.breakdown).forEach(([unitKey, unitValue]: [string, any]) => {
            // Check if it's a simple number value (actual value only)
            if (typeof unitValue === 'number') {
              breakdownDetail.units.push({
                unitName: unitKey,
                actual: unitValue,
                unit: activityValue.unit || '',
              });
            } 
            // Check if it's an object with plan/actual (alternative structure)
            else if (typeof unitValue === 'object' && unitValue !== null) {
              breakdownDetail.units.push({
                unitName: unitKey,
                plan: unitValue.plan || 0,
                actual: unitValue.actual || 0,
                unit: unitValue.unit || activityValue.unit || '',
              });
            }
          });

          if (breakdownDetail.units.length > 0) {
            activityData[activityKey].breakdownDetails.push(breakdownDetail);
          }
        }
      });
    });

    res.json({
      success: true,
      site,
      month,
      year,
      monthName: getMonthName(month),
      data: activityData
    });

  } catch (error: any) {
    console.error('[Statistics Service] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function to get month name
const getMonthName = (month: number): string => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[month - 1] || 'Januari';
};