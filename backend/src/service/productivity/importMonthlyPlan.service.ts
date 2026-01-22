// src/service/produktivity/importMonthlyPlan.service.ts
import { getDataGoogle } from "../../config/googleCredentials";
import { transformMonthlyPlan } from "./transformMonthlyPlan";
import { saveMonthlyPlanService } from "./postProduktivityS";

export const importMonthlyPlanService = async () => {
  const rows = await getDataGoogle();
  const plans = transformMonthlyPlan(rows);

  for (const plan of plans) {
    await saveMonthlyPlanService(
      plan.month,
      plan.site,
      plan.activities
    );
  }
};
