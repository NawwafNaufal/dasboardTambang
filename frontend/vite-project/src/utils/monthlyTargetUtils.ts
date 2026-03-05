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
      max: data.maxDaily,
      min: data.minDaily,
      today: data.averageDaily,
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
    return {
      plan: activityData.plan,
      actual: activityData.actual,
      max: activityData.max,
      min: activityData.min,
      today: activityData.average,
      percentage: activityData.percentage,
      deviation: deviation,
    };
  }

  console.warn('⚠️ [MonthlyTarget] Activity not found, using total');
  return {
    plan: data.totalPlan,
    actual: data.totalActual,
    max: data.maxDaily,
    min: data.minDaily,
    today: data.averageDaily,
    percentage: data.percentage,
    deviation: data.deviation,
  };
};

export const getPerformanceMessage = (currentData: CurrentData): string => {
  const averageFormatted = currentData.today.toLocaleString('id-ID');

  if (currentData.deviation >= 10) {
    return `Outstanding! Average ${averageFormatted} per day.`;
  } else if (currentData.deviation >= 0) {
    return `Great work! Average ${averageFormatted} per day.`;
  } else if (currentData.deviation >= -10) {
    return `Average ${averageFormatted} per day.`;
  } else {
    return `Average ${averageFormatted} per day.`;
  }
};