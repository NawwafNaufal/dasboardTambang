import { Request, Response } from "express";
import { DailyOperation } from "../../model/produktivity/monthly.model";

function getMonthName(month: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1] || "Unknown";
}

export const getMonthlyActualBySite = async (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    const filter: any = {
      date: {
        $gte: `${targetYear}-01-01`,
        $lte: `${targetYear}-12-31`
      }
    };

    const data = await DailyOperation.find(filter).lean();

    // Group by site and activity
    const bySite: any = {};

    data.forEach((doc: any) => {
      const site = doc.site;
      const month = doc.date.substring(5, 7); // Extract month from date

      if (!bySite[site]) {
        bySite[site] = {};
      }

      // Process each activity
      if (doc.activities) {
        const activitiesObj = doc.activities;
        
        Object.keys(activitiesObj).forEach((activityKey) => {
          const activityName = activityKey.replace(/_/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Convert to Title Case

          if (!bySite[site][activityName]) {
            bySite[site][activityName] = {};
          }

          // Initialize month if not exists
          if (!bySite[site][activityName][month]) {
            bySite[site][activityName][month] = 0;
          }

          // Sum ONLY the doc.actual (document level actual) per month
          // BUKAN activity.value
          const actualValue = doc.actual || 0;
          bySite[site][activityName][month] += actualValue;
        });
      }
    });

    // Format response
    const formattedData: any = {};
    
    Object.keys(bySite).forEach((site) => {
      formattedData[site] = {};
      
      Object.keys(bySite[site]).forEach((activityName) => {
        formattedData[site][activityName] = [];
        
        // Create array for all 12 months
        for (let i = 1; i <= 12; i++) {
          const monthKey = String(i).padStart(2, '0');
          const monthName = getMonthName(i);
          
          formattedData[site][activityName].push({
            month: monthName,
            value: Math.round(bySite[site][activityName][monthKey] || 0)
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      year: targetYear,
      data: formattedData
    });

  } catch (error) {
    console.error("Error getting monthly actual by site:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get monthly actual by site",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};