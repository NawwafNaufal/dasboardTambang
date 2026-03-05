import { useState, useEffect } from "react";
import type { MonthlyTargetData } from "../interface/monthlyTarget";

const API_URL = "http://76.13.198.60:4000";

export function useMonthlyTargetData(
  selectedPT: string,
  selectedMonth: number,
  currentYear: number
) {
  const [data, setData] = useState<MonthlyTargetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyTarget = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${API_URL}/api/monthly-target/${encodeURIComponent(selectedPT)}/${currentYear}/${selectedMonth}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        
        if (result.data) {
          setData(result.data);
          console.log('📊 [MonthlyTarget] Data loaded:', result.data);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error('❌ [MonthlyTarget] Error fetching monthly target:', err);
        setError('Failed to load monthly target data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyTarget();
  }, [selectedPT, selectedMonth, currentYear]);

  return { data, loading, error };
}