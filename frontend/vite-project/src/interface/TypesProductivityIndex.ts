export interface MetricData {
  label: string;
  avg: number;
}

export interface DonutSlice {
  pct: number;
  color: string;
  value: number;
}

export interface MonthData {
  month: number;
  average: {
    lbgJam: number;
    mtrJam: number;
    ltrMtr: number;
  };
}