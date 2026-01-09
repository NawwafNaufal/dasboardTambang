import { getSummaryByMonthRepo } from "../../model/produktivity/produktivity.model";
import { getDetailByMonthRepo } from "../../model/produktivity/produktivity.model";
import { getChartByYearRepo } from "../../model/produktivity/produktivity.model";
import { responseError } from "../../error/responseError";

export const getProduktivityByMonthService = async (
  month: number,
  year: number
) => {

    if (!month || !year) {
      throw new responseError("month dan year wajib di isi", 400)
    }

  const [summary, detail] = await Promise.all([
    getSummaryByMonthRepo(month, year),
    getDetailByMonthRepo(month, year)
  ]);

  return summary.map((row: any) => {
    const rowDate = new Date(row.date).toISOString().split('T')[0];
    
    const units = detail
      .filter((d: any) => {
        const detailDate = new Date(d.date).toISOString().split('T')[0];
        return detailDate === rowDate;
      })
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

export const getChartByYearService = async (year: number) => {
  if (!year) {
    throw new responseError("year wajib diisi", 400)
    }

  const data = await getChartByYearRepo(year);

  const groupedByActivity = data.reduce((acc: any, row) => {
    if (!acc[row.activity_name]) {
      acc[row.activity_name] = {
        activity_name: row.activity_name,
        data: Array(12).fill(0) 
      };
    }
    
    acc[row.activity_name].data[row.month - 1] = Number(row.actual);
    
    return acc;
  }, {});

  return Object.values(groupedByActivity);
};