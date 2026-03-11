import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { syncDailyOperationJob } from "./jobs/syncMonthlyPlan.job";
import { error } from "./middleware/errorHandling/error";
import { connectMongo } from "./config/mongo";
import cors from "cors";

import productivity from "./routes/productivity/productivity";
import planRkpa from "./routes/productivity/planRkpa"
import staticD from "./routes/productivity/dailyStatic"
import monthlyTarget from "./routes/productivity/monthlyTarget"
import getActivityUnit from "./routes/productivity/getActivitiesRoute"
import produktivityIndexMounth from "./routes/productivity/getProductivityIndexRoute"
import getUnit from "./routes/productivity/getUnit"
import avaibilityIndex from "./routes/productivity/getTotalPaUaMaUe"
import dailyProductivity from "./routes/productivity/dailyProductivity"

const app = express();
const PORT = process.env.PORT;


app.use(cors({
  origin: ["http://localhost:4000", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
console.log(`ENV : ${process.env.PORT}`);

app.get("/h",(req,res) => {
  res.send("Hello World")
})

app.use("/api", productivity);
app.use("/api",planRkpa)
app.use("/api", staticD)
app.use("/api",monthlyTarget)
app.use("/api",getActivityUnit)
app.use("/api",produktivityIndexMounth)
app.use("/api",getUnit)
app.use("/api",avaibilityIndex)
app.use("/api",dailyProductivity)
app.use(error);

const startServer = async () => {
  try {
    console.log("[STARTUP] Connecting to MongoDB...");
    await connectMongo();
    console.log("[STARTUP] ✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`[STARTUP] ✅ Server listening on PORT: ${PORT}`);
    });

    // console.log("[STARTUP] Starting CRON scheduler...");
    setInterval(async () => {
      // console.log("[CRON] tick");
      try {
        await syncDailyOperationJob();
      } catch (error) {
        console.error("[CRON] Job failed:", error);
      }
    },1 * 60 * 1000);

    console.log("[STARTUP] ✅ CRON scheduler started (every 10s)");
    console.log("[STARTUP] 🚀 All systems ready!");

  } catch (error) {
    console.error("[STARTUP] ❌ Failed to start:", error);
    process.exit(1);
  }
};

startServer();
