import { ProductionUnits } from "../../model/produktivityUnit";

export const getUnitsService = async (site: string, activity: string) => {
  const units = await ProductionUnits.distinct("unit", { site, activity });
  return units;
};