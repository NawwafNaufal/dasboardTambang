import { Request, Response } from "express";
import { getDailyAvailabilityService } from "../../service/productivity/getDailyAvailabilityService";

export const getDailyAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { site, activity, year, month, unit } = req.query;

    if (!site || !activity || !year || !month || !unit) {
      return res.status(400).json({
        success: false,
        message: "site, activity, year, month, unit are required",
      });
    }

    const data = await getDailyAvailabilityService({
      site: String(site),
      activity: String(activity),
      year: Number(year),
      month: Number(month),
      unit: String(unit),
    });

    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};