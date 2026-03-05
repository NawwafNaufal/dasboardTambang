export interface MonthlyData {
  month: string;
  value: number;
}

export interface ActivityData {
  [activityName: string]: MonthlyData[];
}

export interface SiteData {
  [siteName: string]: ActivityData;
}

export interface ApiResponse {
  success: boolean;
  year: number;
  data: SiteData;
}

export interface MonthlySalesChartProps {
  selectedPT?: string;
  apiUrl?: string;
  year?: number;
  currentActivity?: string;
}