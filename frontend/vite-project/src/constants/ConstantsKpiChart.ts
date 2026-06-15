export const BASE_URL = "/api";

export type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

export const MONTHS: Month[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const KPI_OPTIONS = [
  { label: "PA", color: "#60A5FA" },
  { label: "MA", color: "#FACC15" },
  { label: "UA", color: "#4ADE80" },
  { label: "EU", color: "#F87171" },
] as const;

export type KpiLabel = (typeof KPI_OPTIONS)[number]["label"];