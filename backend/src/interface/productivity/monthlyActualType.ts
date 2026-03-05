export interface MonthlyActualResult {
  [site: string]: {
    [activity: string]: {
      month: string;
      value: number;
    }[];
  };
}

export interface StatisticsParams {
  site: string;
  month: number;
  year: number;
}

export interface Params {
  site?: string;
  year?: string;
  month?: string;
}

export interface ActivityRkpa {
  activityName: string;
  planRevenue: number;
  rkpaRevenue: number;
  actual: number;
  planRevenueChange: number;
  rkpaRevenueChange: number;
}

export interface SiteRkpaData {
  activities: ActivityRkpa[];
}