import { ProductionUnits } from "../../model/produktivityUnit";

interface DailyAvailabilityQuery {
  site: string;
  activity: string;
  year: number;
  month: number;
  unit: string;
}

export const getDailyAvailabilityService = async ({
  site,
  activity,
  year,
  month,
  unit,
}: DailyAvailabilityQuery) => {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthStr = monthNames[month - 1];
  const yearShort = String(year).slice(-2);

  const data = await ProductionUnits.aggregate([
    {
      $match: {
        site,
        activity,
        unit,
        date: { $regex: `^\\d{1,2}-${monthStr}-${yearShort}$` },
      },
    },
    {
      $addFields: {
        dayNum: {
          $toInt: { $arrayElemAt: [{ $split: ["$date", "-"] }, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        day: "$dayNum",
        pa: { $ifNull: ["$pa", 0] },
        ma: { $ifNull: ["$ma", 0] },
        ua: { $ifNull: ["$ua", 0] },
        eu: { $ifNull: ["$eu", 0] },
      }
    },
    { $sort: { day: 1 } }
  ]);

  const count = data.length;

  const avgPA = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.pa, 0) / count).toFixed(2))
    : 0;
  const avgMA = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.ma, 0) / count).toFixed(2))
    : 0;
  const avgUA = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.ua, 0) / count).toFixed(2))
    : 0;
  const avgEU = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.eu, 0) / count).toFixed(2))
    : 0;

  return {
    daily: data,
    summary: {
      avgPA,
      avgMA,
      avgUA,
      avgEU,
    }
  };
};