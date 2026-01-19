import { Request,Response,NextFunction } from "express";
import { getProduktivityByMonthService } from "../../service/productivity/getProductivity.service";
import { getChartByYearService } from "../../service/productivity/getProductivity.service";

export const getProduktivityByMonthController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const data = await getProduktivityByMonthService(month, year);

    res.json({ data });

  } catch (error) {
    next(error);
  }
};

export const getChartByYearController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = Number(req.query.year);

    const data = await getChartByYearService(year);

    res.json({ data });

  } catch (error) {
    next(error);
  }
};