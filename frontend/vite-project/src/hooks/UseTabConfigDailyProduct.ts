import { useMemo } from "react";
import { Tab } from "@/constants/ConstantsDailyProduct";
import { DailyState } from "../interface/TypesDailyProduct";

export function useTabConfig(dailyData: DailyState) {
  return useMemo(() => ({
    productivity: {
      title: "Produktivity Index",
      stats: [
        { label: "Lbg/Jam", value: dailyData.summary.totalLbgJam, dec: 2, data: dailyData.lbgJam },
        { label: "Mtr/Jam", value: dailyData.summary.totalMtrJam, dec: 2, data: dailyData.mtrJam },
        { label: "Ltr/Mtr", value: dailyData.summary.totalLtrMtr, dec: 4, data: dailyData.ltrMtr },
      ],
      mainData:   dailyData.lbgJam,
      mainDec:    2,
      mainLabel:  "Lbg/Jam",
      mainColor:  "text-[#fd9141]",
      series: [
        { name: "Lbg/Jam", data: dailyData.lbgJam },
        { name: "Mtr/Jam", data: dailyData.mtrJam },
        { name: "Ltr/Mtr", data: dailyData.ltrMtr },
      ],
      colors: ["#fd9141", "#34D399", "#FACC15"],
      yaxis: [
        {
          seriesName: "Lbg/Jam", min: 0, tickAmount: 5,
          labels: { style: { colors: "#fd9141", fontSize: "11px" }, formatter: (v: number) => v.toFixed(1) },
          title: { text: "Lbg/Jam", style: { color: "#fd9141" } },
        },
        { seriesName: "Mtr/Jam", opposite: false, show: false, min: 0 },
        {
          seriesName: "Ltr/Mtr", opposite: true, min: 0, tickAmount: 5,
          labels: { style: { colors: "#FACC15", fontSize: "11px" }, formatter: (v: number) => v.toFixed(3) },
          title: { text: "Ltr/Mtr", style: { color: "#FACC15" } },
        },
      ],
      tooltipFormatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
        if (seriesIndex === 0) return `${val.toFixed(2)} lbg/jam`;
        if (seriesIndex === 1) return `${val.toFixed(2)} mtr/jam`;
        return `${val.toFixed(4)} ltr/mtr`;
      },
      dataLabelFormatter: (val: number, opts: any) => {
        const si = opts.seriesIndex;
        if (si === 0) return val.toFixed(1);
        if (si === 1) return val.toFixed(1);
        return val.toFixed(3);
      },
      dataLabelColors: ["#fd9141", "#34D399", "#FACC15"],
    },
    fuel: {
      title: "Fuel Consumption",
      stats: [
        { label: "Total Fuel (Ltr)", value: dailyData.summary.totalFuel, dec: 2, data: dailyData.fuel },
      ],
      mainData:   dailyData.fuel,
      mainDec:    2,
      mainLabel:  "Fuel/Hari",
      mainColor:  "text-orange-500 dark:text-orange-400",
      series: [{ name: "Fuel (Ltr)", data: dailyData.fuel }],
      colors: ["#F97316"],
      yaxis: [{
        seriesName: "Fuel (Ltr)", min: 0, tickAmount: 5,
        labels: { style: { colors: "#F97316", fontSize: "11px" }, formatter: (v: number) => v.toFixed(0) },
        title: { text: "Liter", style: { color: "#F97316" } },
      }],
      tooltipFormatter: (val: number) => `${val.toFixed(2)} ltr`,
      dataLabelFormatter: (val: number) => val.toFixed(0),
      dataLabelColors: ["#F97316"],
    },
  } satisfies Record<Tab, unknown>), [dailyData]);
}