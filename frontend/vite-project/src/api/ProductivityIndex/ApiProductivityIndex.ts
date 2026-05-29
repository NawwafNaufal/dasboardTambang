import { BASE_URL, METRICS, YEAR } from "../../constants/ConstantsProductivityIndex";
import { MetricData, MonthData } from "../../interface/TypesProductivityIndex";

export async function fetchUnits(site: string, activity: string): Promise<string[]> {
  const res = await fetch(
    `${BASE_URL}/units?site=${encodeURIComponent(site)}&activity=${encodeURIComponent(activity)}`
  );
  const result = await res.json();
  if (result.success && result.data.length > 0) {
    return result.data as string[];
  }
  return [];
}

export async function fetchProductivityIndex(
  site: string,
  activity: string,
  unit: string,
  selectedMonth: number
): Promise<MetricData[]> {
  const res = await fetch(
    `${BASE_URL}/productivity-index?site=${encodeURIComponent(site)}&activity=${encodeURIComponent(activity)}&year=${YEAR}&unit=${encodeURIComponent(unit)}`
  );
  const result = await res.json();

  if (result.success && result.data.length > 0) {
    const monthData: MonthData | undefined = result.data.find(
      (d: MonthData) => d.month === selectedMonth + 1
    );
    if (monthData) {
      return [
        { label: "Lbg/Jam", avg: monthData.average.lbgJam },
        { label: "Mtr/Jam", avg: monthData.average.mtrJam },
        { label: "Ltr/Mtr", avg: monthData.average.ltrMtr },
      ];
    }
  }

  return METRICS.map((m) => ({ label: m.label, avg: 0 }));
}