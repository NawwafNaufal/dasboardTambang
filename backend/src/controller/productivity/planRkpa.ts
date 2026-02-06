import { NextFunction, Request, Response } from "express";
import { getPlanRkpaByTodayService } from "../../service/productivity/planRkpaProductivity";
import { logger } from "../../log/winston";

export const getPlanRkpa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPlanRkpaByTodayService();
        res.status(200).json({
            success: true,
            ...result,
        });
  } catch (error : any) {
    logger.error("[API] getStatisticsByMonth failed", {
          message: error.message,
          stack: error.stack,
        });
        return next(error)
  }
};
