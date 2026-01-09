import { Request,Response,NextFunction } from "express";
import { getProduktivityByMonthService } from "../../service/productivity/getProductivity.service";


export const getProduktivityByMonthController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    console.log(month,year)

    if (!month || !year) {
      return res.status(400).json({
        message: "month dan year wajib"
      });
    }

    const data = await getProduktivityByMonthService(month, year);

    res.json({ data });

  } catch (error) {
    next(error);
  }
};