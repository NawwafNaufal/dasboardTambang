import { Request, Response } from "express";
import { getProductivityIndexService } from "../../service/productivity/getProductivityIndexService";

export const getProductivityIndexController = async (req: Request, res: Response) => {
  try {
    const { site, activity, year, unit } = req.query;

    if (!site || !activity || !year || !unit) {
      res.status(400).json({
        success: false,
        message: "site, activity, year, dan unit wajib diisi",
      });
      return;
    }

    const data = await getProductivityIndexService({
      site: site as string,
      activity: activity as string,
      year: Number(year),
      unit: unit as string,
    });

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};