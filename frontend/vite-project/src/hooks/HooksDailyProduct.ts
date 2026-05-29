import { useState, useEffect } from "react";
import { fetchUnits, fetchDailyProductivity } from "../api/DailyProduct/ApiDailyProduct";
import { Month } from "@/constants/ConstantsDailyProduct";
import { DailyState, EMPTY_STATE } from "../interface/TypesDailyProduct";

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
      .catch(() => { if (!cancelled) setUnits([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [site, activity]);

  return { units, selectedUnit, setSelectedUnit, loading };
}

interface UseDailyDataResult {
  dailyData: DailyState;
  loading: boolean;
}

export function useDailyData(
  site: string,
  activity: string,
  unit: string,
  month: Month
): UseDailyDataResult {
  const [dailyData, setDailyData] = useState<DailyState>(EMPTY_STATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!site || !activity || !unit) return;
    let cancelled = false;
    setLoading(true);

    fetchDailyProductivity(site, activity, month, unit)
      .then((data) => { if (!cancelled) setDailyData(data); })
      .catch(() => { if (!cancelled) setDailyData(EMPTY_STATE); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [site, activity, unit, month]);

  return { dailyData, loading };
}


export function useDarkMode(): boolean {
  const [isDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  return isDark;
}