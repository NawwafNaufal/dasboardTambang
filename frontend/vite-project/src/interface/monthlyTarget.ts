export interface ActivityBreakdown {
  [key: string]: {
    plan: number;
    actual: number;
    todayActual: number;
    percentage: number;
  };
}

export interface MonthlyTargetData {
  site: string;
  month: string;
  year: number;
  totalPlan: number;
  totalActual: number;
  todayActual: number;
  percentage: number;
  deviation: number;
  activityBreakdown: ActivityBreakdown;
}

export interface MonthlyTargetProps {
  selectedPT?: string;
  currentActivity?: string;
}

export interface CurrentData {
  plan: number;
  actual: number;
  today: number;
  percentage: number;
  deviation: number;
}