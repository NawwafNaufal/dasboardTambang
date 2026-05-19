export interface DailyRecord {
  day: number;
  pa?: number;
  ma?: number;
  ua?: number;
  eu?: number;
}

export interface ChartSummary {
  avgPA: number;
  avgMA: number;
  avgUA: number;
  avgEU: number;
}

export interface ChartData {
  PA: number[];
  MA: number[];
  UA: number[];
  EU: number[];
  days: string[];
  summary: ChartSummary;
}

export const EMPTY_CHART: ChartData = {
  PA: [],
  MA: [],
  UA: [],
  EU: [],
  days: [],
  summary: { avgPA: 0, avgMA: 0, avgUA: 0, avgEU: 0 },
};