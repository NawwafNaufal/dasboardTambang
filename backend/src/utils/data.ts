export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const getMonthName = (month: number): string =>
  MONTH_NAMES[month - 1] ?? "January";


export function getMonthDateRange(year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;
  return { startDate, endDate };
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}