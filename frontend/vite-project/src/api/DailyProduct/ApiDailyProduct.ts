import { BASE_URL, MONTHS, Month } from "@/constants/ConstantsDailyProduct";
import { DailyState, DailyRecord, EMPTY_STATE } from "../../interface/TypesDailyProduct";

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

export async function fetchDailyProductivity(
  site: string,
  activity: string,
  month: Month,
  unit: string
): Promise<DailyState> {
  const monthIdx = MONTHS.indexOf(month) + 1;
  const res = await fetch(
    `${BASE_URL}/daily-productivity?site=${encodeURIComponent(site)}&activity=${encodeURIComponent(activity)}&year=2026&month=${monthIdx}&unit=${encodeURIComponent(unit)}`
  );
  const result = await res.json();

  if (result.success && result.data.daily.length > 0) {
    const raw: DailyRecord[] = result.data.daily;
    const s = result.data.summary;
    return {
      lbgJam: raw.map((d) => d.lbgJam),
      mtrJam: raw.map((d) => d.mtrJam),
      ltrMtr: raw.map((d) => d.ltrMtr),
      fuel:   raw.map((d) => d.fuel),
      plan:   s.plan,
      days:   raw.map((d) => `${d.day}`),
      summary: {
        totalFuel:   s.totalFuel,
        totalLbgJam: s.totalLbgJam,
        totalMtrJam: s.totalMtrJam,
        totalLtrMtr: s.totalLtrMtr,
      },
    };
  }

  return EMPTY_STATE;
}