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
    // ✅ Konversi tanggal ke format YYYY-MM-DD untuk perbandingan
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