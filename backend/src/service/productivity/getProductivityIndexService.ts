import { ProductionUnits } from "../../model/produktivityUnit";

const MONTH_MAP: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

interface ProductivityIndexQuery {
  site: string;
  activity: string;
  year: number;
  unit: string;
}

export const getProductivityIndexService = async ({
  site,
  activity,
  year,
  unit,
}: ProductivityIndexQuery) => {
  const data = await ProductionUnits.aggregate([
    {
      $match: {
        site,
        activity,
        unit,
        date: { $regex: `^\\d{1,2}-\\w{3}-${String(year).slice(-2)}$` },
      },
    },
    {
      // split "1-Jan-26" → ["1", "Jan", "26"]
      $addFields: {
        dateParts: { $split: ["$date", "-"] },
      },
    },
    {
      // ambil bagian bulan (index 1) → "Jan"
      $addFields: {
        monthStr: { $arrayElemAt: ["$dateParts", 1] },
      },
    },
    {
      // convert "Jan" → 1, "Feb" → 2, dst
      $addFields: {
        month: {
          $switch: {
            branches: Object.entries(MONTH_MAP).map(([k, v]) => ({
              case: { $eq: ["$monthStr", k] },
              then: v,
            })),
            default: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        avgLbgJam: { $avg: "$produktivityIndex.lbgJam" },
        avgMtrJam: { $avg: "$produktivityIndex.mtrJam" },
        avgLtrMtr: { $avg: "$produktivityIndex.ltrMtr" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        average: {
          lbgJam: { $round: ["$avgLbgJam", 3] },
          mtrJam: { $round: ["$avgMtrJam", 3] },
          ltrMtr: { $round: ["$avgLtrMtr", 3] },
        },
      },
    },
    { $sort: { month: 1 } },
  ]);

  return data;
};