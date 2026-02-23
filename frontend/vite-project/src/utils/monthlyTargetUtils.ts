import type { MonthlyTargetData, CurrentData } from "../interface/monthlyTarget";

export const normalizeActivityName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '_');
};

export const getMonthName = (monthNum: number) => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[monthNum - 1];
};

export const getCurrentActivityData = (
  data: MonthlyTargetData,
  currentActivity?: string
): CurrentData => {
  if (!currentActivity || currentActivity === "All Activities") {
    return {
      plan: data.totalPlan,
      actual: data.totalActual,
      today: data.todayActual,
      percentage: data.percentage,
      deviation: data.deviation,
    };
  }

  const normalizedCurrent = normalizeActivityName(currentActivity);
  console.log('🔎 [MonthlyTarget] Looking for activity:', normalizedCurrent);
  console.log('📋 [MonthlyTarget] Available activities:', Object.keys(data.activityBreakdown));
  
  const activityKey = Object.keys(data.activityBreakdown).find(
    key => normalizeActivityName(key) === normalizedCurrent
  );
  
  if (activityKey) {
    const activityData = data.activityBreakdown[activityKey];
    const deviation = activityData.percentage - 100;
    console.log('✅ [MonthlyTarget] Found activity:', activityKey);
    console.log('📊 [MonthlyTarget] Activity todayActual:', activityData.todayActual);
    return {
      plan: activityData.plan,
      actual: activityData.actual,
      today: activityData.todayActual,
      percentage: activityData.percentage,
      deviation: deviation,
    };
  }
  
  console.warn('⚠️ [MonthlyTarget] Activity not found, using total');
  return {
    plan: data.totalPlan,
    actual: data.totalActual,
    today: data.todayActual,
    percentage: data.percentage,
    deviation: data.deviation,
  };
};

export const getPerformanceMessage = (currentData: CurrentData): string => {
  const averageFormatted = currentData.today.toLocaleString('id-ID');
  
  if (currentData.deviation >= 10) {
    return `Average ${averageFormatted}`;
  } else if (currentData.deviation >= 0) {
    return `Average ${averageFormatted}.`;
  } else if (currentData.deviation >= -10) {
    return `Average ${averageFormatted}.`;
  } else {
    return `Average ${averageFormatted}.`;
  }
};