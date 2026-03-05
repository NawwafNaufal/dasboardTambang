import { NextFunction, Request, Response } from "express";
import { getStatisticsByMonthService } from "../../service/productivity/dailyStatic";
import { logger } from "../../log/winston";

export const getStatisticsByMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const site = (req.query.site as string) || "PT Semen Tonasa";
    const month = Number(req.query.month) || 1;
    const year = Number(req.query.year) || 2025;

    const result = await getStatisticsByMonthService({
      site,
      month,
      year,
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    logger.error("[API] getStatisticsByMonth failed", {
      message: error.message,
      stack: error.stack,
    });
    return next(error)
  }
};
