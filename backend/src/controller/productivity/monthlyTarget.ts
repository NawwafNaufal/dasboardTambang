import { NextFunction, Request, Response } from "express";
import { getMonthlyTargetService } from "../../service/productivity/monthlyTarget";
import { logger } from "../../log/winston";

export const getMonthlyTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const data = await getMonthlyTargetService(req.params);

        res.status(200).json({
            message : "Data MonthlyTarget",
            data
        });
  } catch (error : any) {
    logger.error("[API] getStatisticsByMonth failed", {
      message: error.message,
      stack: error.stack,
    });
    return next(error)
  }
};
