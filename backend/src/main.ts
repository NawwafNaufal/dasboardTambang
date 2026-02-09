import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { syncDailyOperationJob } from "./jobs/syncMonthlyPlan.job";
import { error } from "./middleware/errorHandling/error";
import { connectMongo } from "./config/mongo";

import productivity from "./routes/productivity/productivity";
import planRkpa from "./routes/productivity/planRkpa";
import staticD from "./routes/productivity/dailyStatic";
import monthlyTarget from "./routes/productivity/monthlyTarget";

import { logger } from "./log/winston";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: ["http://localhost:4000", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/h", (req, res) => {
  logger.info("[HTTP] GET /h accessed");
  res.send("Hello World");
});

app.use("/api", productivity);
app.use("/api", planRkpa);
app.use("/api", staticD);
app.use("/api", monthlyTarget);

app.use(error);

const startServer = async () => {
  try {
    logger.info("[STARTUP] Connecting to MongoDB...");
    await connectMongo();
    logger.info("[STARTUP] ✅ MongoDB Connected");

    app.listen(PORT, () => {
      logger.info(`[STARTUP] ✅ Server listening on PORT: ${PORT}`);
    });

    logger.info("[STARTUP] Starting CRON scheduler...");
    setInterval(async () => {
      logger.debug("[CRON] Tick - syncDailyOperationJob running");
      try {
        await syncDailyOperationJob();
      } catch (error) {
        logger.error("[CRON] Job failed:", error);
      }
    }, 10_000);

    logger.info("[STARTUP] 🚀 All systems ready!");
  } catch (error) {
    logger.error("[STARTUP] ❌ Failed to start:", error);
    process.exit(1);
  }
};

startServer();
