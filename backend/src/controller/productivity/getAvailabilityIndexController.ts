import { Request, Response } from "express";
import { getAvailabilityIndexService } from "../../service/productivity/getAvailabilityIndexService";

export const getAvailabilityIndexController = async (req: Request, res: Response) => {
  try {
    const { site, activity, year, unit } = req.query;

    if (!site || !activity || !year || !unit) {
      return res.status(400).json({
        success: false,
        message: "site, activity, year, unit are required",
      });
    }

    const data = await getAvailabilityIndexService({
      site: String(site),
      activity: String(activity),
      year: Number(year),
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