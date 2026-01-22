// cron.ts
import cron from "node-cron";
import { importMonthlyPlanJob } from "../jobs/importMonthlyPlan.job";

export const initCronJobs = () => {
  // jalan tiap 1 jam
  cron.schedule("0 * * * *", async () => {
    console.log("[CRON] Start monthly plan sync");
    await importMonthlyPlanJob();
  });
};
