import { ProductionUnits } from "../../model/produktivityUnit";

export const getActivitiesService = async () => {
  const activities = await ProductionUnits.distinct("activity");
  return activities;
};