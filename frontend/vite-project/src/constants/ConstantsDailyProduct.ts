export const BASE_URL = "http://43.157.205.66:4000/api";

export type Month =
  | "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun"
  | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

export const MONTHS: Month[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type Tab = "productivity" | "fuel";

export const TABS: Tab[] = ["productivity", "fuel"];