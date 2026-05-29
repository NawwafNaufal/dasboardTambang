import { useState, useEffect } from "react";
import { fetchUnits, fetchProductivityIndex } from "../../api/ProductivityIndex/ApiProductivityIndex";
import { MetricData } from "../../interface/TypesProductivityIndex";
import { METRICS } from "../../constants/ConstantsProductivityIndex";

export function useDarkMode(): boolean {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return dark;
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
      .catch(() => { if (!cancelled) setUnits([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [site, activity]);

  return { units, selectedUnit, setSelectedUnit, loading };
}

interface UseMetricsResult {
  metrics: MetricData[];
  loading: boolean;
}

export function useMetrics(
  site: string,
  activity: string,
  unit: string,
  selectedMonth: number
): UseMetricsResult {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!site || !activity || !unit) return;
    let cancelled = false;
    setLoading(true);

    fetchProductivityIndex(site, activity, unit, selectedMonth)
      .then((data) => { if (!cancelled) setMetrics(data); })
      .catch(() => {
        if (!cancelled) setMetrics(METRICS.map((m) => ({ label: m.label, avg: 0 })));
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [site, activity, unit, selectedMonth]);

  return { metrics, loading };
}