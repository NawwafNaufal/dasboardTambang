import { getSummaryByMonthRepo } from "../../model/produktivity/produktivity.model";
import { getDetailByMonthRepo } from "../../model/produktivity/produktivity.model";

export const getProduktivityByMonthService = async (
  month: number,
  year: number
) => {

  const [summary, detail] = await Promise.all([
    getSummaryByMonthRepo(month, year),
    getDetailByMonthRepo(month, year)
  ]);


  console.log(summary.length)
  console.log(detail.length)

  return summary.map((row: any) => {
    const units = detail
      .filter((d: any) => d.date === row.date)
      .reduce((acc: any, cur: any) => {
        acc[cur.unit_name] = cur.value_input;
        return acc;
      }, {});

    return {
      date: row.date,
      activity_name: row.activity_name,
      plan: row.plan,
      rkap: row.rkap,
      actual: row.actual,
      units
    };
  });
};