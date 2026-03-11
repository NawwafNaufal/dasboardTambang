import { Request, Response } from "express";
import { getUnitsService } from "../../service/productivity/getUnitsService";

export const getUnitsController = async (req: Request, res: Response) => {
  try {
    const { site, activity } = req.query;

    if (!site || !activity) {
      res.status(400).json({
        success: false,
        message: "site dan activity wajib diisi",
      });
      return;
    }

    const units = await getUnitsService(site as string, activity as string);
    res.json({ success: true, data: units });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};