import { ProductionUnits } from "../../model/produktivityUnit";

interface DailyProductivityQuery {
  site: string;
  activity: string;
  year: number;
  month: number;
  unit: string;
}

export const getDailyProductivityService = async ({
  site,
  activity,
  year,
  month,
  unit,
}: DailyProductivityQuery) => {
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
        lbgJam: { $ifNull: ["$produktivityIndex.lbgJam", 0] },
        mtrJam: { $ifNull: ["$produktivityIndex.mtrJam", 0] },
        ltrMtr: { $ifNull: ["$produktivityIndex.ltrMtr", 0] },
        fuel:   { $ifNull: ["$fuel", 0] },
        plan:   { $ifNull: ["$plan", 0] },
      }
    },
    { $sort: { day: 1 } }
  ]);

  const count = data.length;

  const avgLbgJam = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.lbgJam, 0) / count).toFixed(3))
    : 0;
  const avgMtrJam = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.mtrJam, 0) / count).toFixed(3))
    : 0;
  const avgLtrMtr = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.ltrMtr, 0) / count).toFixed(4))
    : 0;
  const avgFuel = count > 0
    ? parseFloat((data.reduce((s, d) => s + d.fuel, 0) / count).toFixed(2))
    : 0;

  const totalLbgJam = parseFloat(data.reduce((s, d) => s + d.lbgJam, 0).toFixed(2));
  const totalMtrJam = parseFloat(data.reduce((s, d) => s + d.mtrJam, 0).toFixed(2));
  const totalLtrMtr = parseFloat(data.reduce((s, d) => s + d.ltrMtr, 0).toFixed(4));
  const totalFuel   = parseFloat(data.reduce((s, d) => s + d.fuel,   0).toFixed(2));

  const plan = data.length > 0 ? data[0].plan : 0;

  return {
    daily: data,
    summary: {
      avgLbgJam,
      avgMtrJam,
      avgLtrMtr,
      avgFuel,
      totalLbgJam,
      totalMtrJam,
      totalLtrMtr,
      totalFuel,
      plan,
    }
  };
};