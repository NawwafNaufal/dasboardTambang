export interface ActivityBreakdown {
  [key: string]: {
    plan: number;
    actual: number;
    max: number;
    min: number;
    average: number;
    percentage: number;
  };
}

export interface MonthlyTargetData {
  site: string;
  month: string;
  year: number;
  totalPlan: number;
  totalActual: number;
  maxDaily: number;
  minDaily: number;
  averageDaily: number;
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
  max: number;
  min: number;
  today: number;  
  percentage: number;
  deviation: number;
}