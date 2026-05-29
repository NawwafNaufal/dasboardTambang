export interface DailyRecord {
  day: number;
  lbgJam: number;
  mtrJam: number;
  ltrMtr: number;
  fuel: number;
}

export interface DailySummary {
  totalFuel: number;
  totalLbgJam: number;
  totalMtrJam: number;
  totalLtrMtr: number;
  plan: number;
}

export interface DailyState {
  lbgJam: number[];
  mtrJam: number[];
  ltrMtr: number[];
  fuel: number[];
  plan: number;
  days: string[];
  summary: Omit<DailySummary, "plan">;
}

export const EMPTY_STATE: DailyState = {
  lbgJam: [],
  mtrJam: [],
  ltrMtr: [],
  fuel: [],
  plan: 0,
  days: [],
  summary: {
    totalFuel: 0,
    totalLbgJam: 0,
    totalMtrJam: 0,
    totalLtrMtr: 0,
  },
};