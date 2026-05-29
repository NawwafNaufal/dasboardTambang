import { useMemo } from "react";
import { MetricData, DonutSlice } from "../../interface/TypesProductivityIndex";
import { METRICS } from "../../constants/ConstantsProductivityIndex";

interface UseDonutSlicesResult {
  slices: DonutSlice[];
  totalValue: string;
}

export function useDonutSlices(metrics: MetricData[]): UseDonutSlicesResult {
  const slices = useMemo<DonutSlice[]>(() => {
    if (metrics.length === 0) {
      return METRICS.map((m) => ({ pct: 33.3, color: m.color, value: 0 }));
    }
    const total = metrics.reduce((s, m) => s + m.avg, 0);
    if (total === 0) {
      return METRICS.map((m) => ({ pct: 33.3, color: m.color, value: 0 }));
    }
    return metrics.map((m, i) => ({
      pct: (m.avg / total) * 100,
      color: METRICS[i].color,
      value: m.avg,
    }));
  }, [metrics]);

  const totalValue = useMemo(() => {
    const total = metrics.reduce((s, m) => s + m.avg, 0);
    return total.toFixed(2);
  }, [metrics]);

  return { slices, totalValue };
}