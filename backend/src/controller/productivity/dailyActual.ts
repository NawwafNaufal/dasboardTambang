import { NextFunction, Request, Response } from "express";
import { getMonthlyActualBySiteService } from "../../service/productivity/dailyReport";
import { logger } from "../../log/winston";

export const getMonthlyActualBySite = async (req: Request, res: Response,  next: NextFunction) => {
  try {
    const year = req.query.year
      ? Number(req.query.year)
      : new Date().getFullYear();

    const data = await getMonthlyActualBySiteService(year);

    res.status(200).json({
      success: true,
      year,
      data,
    });
  } catch (error: any) {
    logger.error("[API] getMonthlyActualBySite failed", {
      message: error.message,
      stack: error.stack,
    });
    return next(error)
  }
};
