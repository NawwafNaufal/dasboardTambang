import { Request, Response } from "express";
import { DailyOperation } from "../../model/produktivity/monthly.model";

function getMonthName(month: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[month - 1] || "Unknown";
}

// Helper function untuk extract string dari params
function getParamAsString(param: string | string[] | undefined): string {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param || "";
}

/**
 * GET Monthly Target - Total Plan & Actual per bulan + Today Actual
 * Endpoint: GET /api/monthly-target/:site/:year/:month
 */
export const getMonthlyTarget = async (req: Request, res: Response) => {
  try {
    // Extract params as strings using helper function
    const site = getParamAsString(req.params.site);
    const year = getParamAsString(req.params.year);
    const month = getParamAsString(req.params.month);

    // Validasi params tidak undefined
    if (!site || !year || !month) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid year or month parameter",
      });
    }

    // Date range untuk bulan ini
    const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
    const endDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-31`;
    const today = new Date().toISOString().split("T")[0];

    // Query data
    const data = await DailyOperation.find({
      site: site,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    // Hitung total dan breakdown per activity
    let totalPlan = 0;
    let totalActual = 0;
    let todayActual = 0;
    const activityBreakdown: {
      [key: string]: { plan: number; actual: number; todayActual: number };
    } = {};

    // First pass: initialize all activities and calculate cumulative totals
    data.forEach((doc: any) => {
      const activities = doc.activities;
      
      if (activities) {
        // Convert Map to object if needed
        const activitiesObj =
          activities instanceof Map ? Object.fromEntries(activities) : activities;

        Object.entries(activitiesObj).forEach(([activityName, activity]: [string, any]) => {
          const plan = activity.plan || 0;
          const actual = activity.actual || 0;

          // Add to totals
          totalPlan += plan;
          totalActual += actual;

          // Initialize activity breakdown if not exists
          if (!activityBreakdown[activityName]) {
            activityBreakdown[activityName] = { plan: 0, actual: 0, todayActual: 0 };
          }
          activityBreakdown[activityName].plan += plan;
          activityBreakdown[activityName].actual += actual;
        });
      }
    });

    // Second pass: get today's actual values only (overwrite, not accumulate)
    const todayDoc = data.find((doc: any) => doc.date === today);
    if (todayDoc && todayDoc.activities) {
      const todayActivities =
        todayDoc.activities instanceof Map 
          ? Object.fromEntries(todayDoc.activities) 
          : todayDoc.activities;

      Object.entries(todayActivities).forEach(([activityName, activity]: [string, any]) => {
        const actual = activity.actual || 0;
        
        // Set today's actual for this specific activity (not cumulative)
        if (activityBreakdown[activityName]) {
          activityBreakdown[activityName].todayActual = actual;
        }
        
        // Add to total today actual
        todayActual += actual;
      });
    }

    // Calculate percentage
    const percentage = totalPlan > 0 ? (totalActual / totalPlan) * 100 : 0;
    const deviation = percentage - 100;

    // Format activity breakdown with percentage
    const formattedActivityBreakdown: {
      [key: string]: { plan: number; actual: number; todayActual: number; percentage: number };
    } = {};

    Object.entries(activityBreakdown).forEach(([name, data]) => {
      formattedActivityBreakdown[name] = {
        plan: Math.round(data.plan),
        actual: Math.round(data.actual),
        todayActual: Math.round(data.todayActual),
        percentage: data.plan > 0 ? parseFloat(((data.actual / data.plan) * 100).toFixed(2)) : 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        site: site,
        month: getMonthName(monthNum),
        year: yearNum,
        totalPlan: Math.round(totalPlan),
        totalActual: Math.round(totalActual),
        todayActual: Math.round(todayActual),
        percentage: parseFloat(percentage.toFixed(2)),
        deviation: parseFloat(deviation.toFixed(2)),
        activityBreakdown: formattedActivityBreakdown,
      },
    });
  } catch (error) {
    console.error("Error getting monthly target:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get monthly target",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};