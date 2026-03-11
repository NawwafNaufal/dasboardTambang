import { Request, Response } from "express";
import { getActivitiesService } from "../../service/productivity/getActivitiesService";

export const getActivitiesController = async (req: Request, res: Response) => {
  try {
    const activities = await getActivitiesService();
    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};