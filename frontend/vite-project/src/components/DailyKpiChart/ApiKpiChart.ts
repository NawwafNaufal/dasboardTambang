import { BASE_URL } from "../../constants/ConstantsKpiChart";
import { ChartData, DailyRecord, EMPTY_CHART } from "../../interface/TypesKpiChart";

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

export async function fetchDailyAvailability(
  site: string,
  activity: string,
  year: number,
  month: number,
  unit: string
): Promise<ChartData> {
  const res = await fetch(
    `${BASE_URL}/daily-availability?site=${encodeURIComponent(site)}&activity=${encodeURIComponent(activity)}&year=${year}&month=${month}&unit=${encodeURIComponent(unit)}`
  );
  const result = await res.json();

  if (result.success && result.data.daily.length > 0) {
    const raw: DailyRecord[] = result.data.daily;
    return {
      PA: raw.map((d) => d.pa ?? 0),
      MA: raw.map((d) => d.ma ?? 0),
      UA: raw.map((d) => d.ua ?? 0),
      EU: raw.map((d) => d.eu ?? 0),
      days: raw.map((d) => `${d.day}`),
      summary: result.data.summary,
    };
  }

  return EMPTY_CHART;
}