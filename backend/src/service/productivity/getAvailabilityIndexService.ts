import { ProductionUnits } from "../../model/produktivityUnit";

const MONTH_MAP: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

interface AvailabilityQuery {
  site: string;
  activity: string;
  year: number;
  unit: string;
}

export const getAvailabilityIndexService = async ({
  site,
  activity,
  year,
  unit,
}: AvailabilityQuery) => {
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
      $addFields: {
        dateParts: { $split: ["$date", "-"] },
      },
    },
    {
      $addFields: {
        monthStr: { $arrayElemAt: ["$dateParts", 1] },
      },
    },
    {
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
        avgPA: { $avg: "$pa" },
        avgMA: { $avg: "$ma" },
        avgUA: { $avg: "$ua" },
        avgEU: { $avg: "$eu" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        pa: { $round: ["$avgPA", 2] },
        ma: { $round: ["$avgMA", 2] },
        ua: { $round: ["$avgUA", 2] },
        eu: { $round: ["$avgEU", 2] },
      },
    },
    { $sort: { month: 1 } },
  ]);

  return data;
};