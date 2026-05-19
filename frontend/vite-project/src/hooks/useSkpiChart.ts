import { useState, useEffect } from "react";
import { fetchUnits, fetchDailyAvailability } from "@/components/DailyKpiChart/ApiKpiChart";
import { MONTHS, Month } from "../constants/ConstantsKpiChart";
import { ChartData, EMPTY_CHART } from "../interface/TypesKpiChart";

export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

interface UseUnitsResult {
  units: string[];
  selectedUnit: string;
  setSelectedUnit: (unit: string) => void;
  loading: boolean;
}

export function useUnits(site: string, activity: string): UseUnitsResult {
  const [units, setUnits] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!site || !activity) return;

    let cancelled = false;
    setLoading(true);

    fetchUnits(site, activity)
      .then((data) => {
        if (cancelled) return;
        setUnits(data);
        setSelectedUnit(data[0] ?? "");
      })
      .catch(() => {
        if (!cancelled) setUnits([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [site, activity]);

  return { units, selectedUnit, setSelectedUnit, loading };
}

interface UseChartDataResult {
  chartData: ChartData;
  loading: boolean;
}

export function useChartData(
  site: string,
  activity: string,
  unit: string,
  month: Month
): UseChartDataResult {
  const [chartData, setChartData] = useState<ChartData>(EMPTY_CHART);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!site || !activity || !unit) return;

    let cancelled = false;
    const monthIdx = MONTHS.indexOf(month) + 1;
    setLoading(true);

    fetchDailyAvailability(site, activity, 2026, monthIdx, unit)
      .then((data) => { if (!cancelled) setChartData(data); })
      .catch(() => { if (!cancelled) setChartData(EMPTY_CHART); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [site, activity, unit, month]);

  return { chartData, loading };
}